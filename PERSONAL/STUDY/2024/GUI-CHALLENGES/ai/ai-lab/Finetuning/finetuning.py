import sys
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    DataCollatorWithPadding,
    TrainingArguments,
    Trainer)
from peft import get_peft_model, LoraConfig
import evaluate
import torch
import numpy as np
import pickle

# This piece of code appears to load a dataset named 'shawhin/imdb-truncated', likely related to IMDb movie reviews.
# Then, it calculates the proportion of positive labels in the training subset of the dataset.
# Essentially, it's finding the percentage of positive sentiment labels in the training data.
dataset = load_dataset('shawhin/imdb-truncated')
np.array(dataset['train']['label']).sum()/len(dataset['train']['label'])


# Specifies a model checkpoint named 'distilbert-base-uncased'.
# In the context of Natural Language Processing (NLP), a model checkpoint refers to a pre-trained model that has
# been saved at a particular point during training. 'distilbert-base-uncased' likely refers to a variant of the
# DistilBERT model, a lighter version of the BERT model that has been pre-trained on a large corpus of text data.
# The "uncased" part suggests that the model is case-insensitive, meaning it treats uppercase and lowercase letters
# as the same.
model_checkpoint = 'distilbert-base-uncased'
# model_checkpoint = 'roberta-base' # you can alternatively use roberta-base but this model is bigger thus training will take longer

# define mappings between numerical labels and their corresponding textual representations for sentiment analysis.
# Specifically, id2label maps numerical labels (0 and 1) to their corresponding sentiment categories
# ("Negative" and "Positive" respectively), while label2id maps sentiment categories to their corresponding numerical
# labels. This mapping allows for easy conversion between numerical and textual representations of sentiment labels
# within the model.
id2label = {0: "Negative", 1: "Positive"}
label2id = {"Negative": 0, "Positive": 1}

# This line of code initializes a model for sequence classification using the AutoModelForSequenceClassification
# class from the Hugging Face transformers library. It loads a pre-trained model specified by the model_checkpoint
# variable, which is likely 'distilbert-base-uncased'. The model is configured for binary classification with two
# output labels: "Negative" and "Positive". The id2label and label2id mappings are provided to the model to facilitate
# conversion between numerical label indices and their corresponding textual representations during training
# and inference.
model = AutoModelForSequenceClassification.from_pretrained(
    model_checkpoint, num_labels=2, id2label=id2label, label2id=label2id)

# This line of code initializes a tokenizer for tokenizing input text using the AutoTokenizer class from the
# Hugging Face transformers library. It loads a pre-trained tokenizer specified by the model_checkpoint variable,
# likely 'distilbert-base-uncased'. The add_prefix_space=True parameter indicates that a space will be added before
# each tokenized input sequence. This is a common preprocessing step for certain tokenizers, especially when dealing
# with languages like English where spaces separate words in a sentence.
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint, add_prefix_space=True)

# This code block checks if the tokenizer has a special token designated for padding sequences.
# If it doesn't (i.e., tokenizer.pad_token is None) then,
if tokenizer.pad_token is None:

    # it adds a special token for padding with the label '[PAD]' '})
    tokenizer.add_special_tokens({'pad_token': '[PAD]'})

    # Additionally, it resizes the token embeddings of the model to match the updated tokenizer's vocabulary size
    model.resize_token_embeddings(len(tokenizer))

# create tokenize function
def tokenize_function(examples):
    '''
    This function tokenizes and truncates the input text from a dataset. Tokenization
    is the process of converting text into a sequence of tokens, where each token
    represents a meaningful unit of the text, such as words or subwords. Truncation
    refers to the process of shortening sequences to a specified maximum length,
    which is often necessary for efficient processing by machine learning models.

    Parameters:
        examples (dict): A dictionary containing the input text to be tokenized.

    Returns:
        dict: A dictionary containing the tokenized inputs.
    '''

    # It extracts the text data from the examples provided.
    text = examples["text"]

    # It configures the tokenizer to truncate sequences from the left side.
    tokenizer.truncation_side = "left"

    # It tokenizes the text using the configured tokenizer with truncation enabled and a maximum sequence length of 512 tokens.
    tokenized_inputs = tokenizer(
        text,
        return_tensors="np",
        truncation=True,
        max_length=512
    )

    return tokenized_inputs

# This section tokenizes the input text data in the dataset using the specified
# tokenization function (`tokenize_function`). Tokenization involves converting
# the raw text into a format suitable for input to the machine learning model,
# which typically includes breaking the text into individual tokens or words.
# Additionally, it prepares the dataset for training by mapping the tokenization
# function to each batch of data in the dataset.
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# This section creates a data collator object (`data_collator`) that will be used
# during training to batch and pad tokenized inputs. Data collators are responsible
# for batching together samples, ensuring that inputs within a batch are of the same
# length by padding shorter sequences, which is necessary for efficient training.
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
#
# This variable loads a pre-defined evaluation metric for accuracy from a module or file named "accuracy".
# Accuracy is a common metric used to evaluate classification models, indicating the proportion of correctly
# classified samples out of the total number of samples. Loading the accuracy metric allows for easy
# evaluation of model performance based on its ability to correctly predict labels compared to ground truth.
accuracy = evaluate.load("accuracy")

# define an evaluation function to pass into trainer later
def compute_metrics(p):
    '''
    This function computes evaluation metrics based on model predictions and ground truth labels.
    It calculates accuracy by comparing the predicted labels generated by the model with the actual
    labels (references) and determining the proportion of correctly classified samples.

    Parameters:
        p (tuple): A tuple containing the model predictions and the ground truth labels.

    Returns:
        dict: A dictionary containing computed evaluation metrics, with accuracy as the key.
    '''
    predictions, labels = p
    predictions = np.argmax(predictions, axis=1)
    return {"accuracy": accuracy.compute(predictions=predictions, references=labels)}

# define list of examples to test the untrained model
text_list = ["It was good.", "Not a fan, don't recommed.", "Better than the first one.", "This is not worth watching even once.", "This one is a pass."]

print("Untrained model predictions:")
print("----------------------------")

#  This loop iterates over a list of movie review texts and makes predictions using an untrained model.
#     Additional Steps:
#         - Tokenizes each review text using the specified tokenizer. Tokenization is the process of converting
#           a sequence of characters into a sequence of tokens (words or subwords) that can be processed by the model.
#         - Converts the tokenized input into PyTorch tensors. PyTorch tensors are multi-dimensional arrays,
#           similar to NumPy arrays, but with additional functionalities optimized for deep learning tasks.
#           These tensors are required as input for the model.
#         - Computes logits (raw output scores) for each tokenized input using the model. Logits represent the
#           unnormalized probabilities assigned to each class by the model.
#         - Converts logits to predicted labels by selecting the index of the maximum value. This determines the
#           predicted sentiment label for each review text.
for text in text_list:
    # tokenize text
    inputs = tokenizer.encode(text, return_tensors="pt")
    # compute logits
    logits = model(inputs).logits
    # convert logits to label
    predictions = torch.argmax(logits)

    print(text + " - " + id2label[predictions.tolist()])

# This code sets up a configuration for a special way of training a computer program that learns from examples. This special way is called LoRA. It helps the program understand patterns better.
# The configuration tells the program how to use LoRA:
# - It's going to work on a specific type of task where the program has to understand sequences (like sentences).
# - There are some special settings (like `r`, `lora_alpha`, and `lora_dropout`) that LoRA needs to do its job properly. These settings are like instructions for LoRA on how hard to work and what to focus on.
# - It's also told which parts of the program to apply LoRA to. In this case, it's just a specific part called 'q_lin'.
peft_config = LoraConfig(task_type="SEQ_CLS",
                        r=4,
                        lora_alpha=32,
                        lora_dropout=0.01,
                        target_modules = ['q_lin'])

# This code prepares the model to use the LoRA technique for training. LoRA helps the model learn patterns better from the training data.
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()

# Hyperparameters are special settings that we choose before training a machine learning model. These settings control how the training process works and can greatly affect the model's performance.
# - lr (learning rate): This is a hyperparameter that determines how much the model's parameters are adjusted during training. A higher learning rate means larger adjustments, which can lead to faster training but may cause the model to overshoot and perform poorly.
# - batch_size: This hyperparameter defines the number of training examples processed together in each iteration during training. A larger batch size can speed up training but requires more memory.
# - num_epochs: This hyperparameter specifies the number of times the entire dataset is processed during training. Each pass through the dataset is called an epoch. Increasing the number of epochs allows the model to see more examples and potentially improve its performance, but training for too many epochs can lead to overfitting.
# By setting these hyperparameters, we control how the model learns from the training data and how it improves over time.

lr = 1e-3
batch_size = 4
num_epochs = 10


# Training arguments are settings that control the training process of a machine learning model. These settings include details such as where to save the trained model, how many epochs to train for, and how to handle evaluation.
#
# In this code:
# - output_dir: This specifies the directory where the trained model and related files will be saved.
# - learning_rate: This sets the rate at which the model's parameters are adjusted during training, similar to the lr hyperparameter.
# - per_device_train_batch_size: This sets the number of training examples processed together on each device (e.g., GPU) in each iteration.
# - per_device_eval_batch_size: This sets the batch size for evaluation, similar to per_device_train_batch_size but for evaluation.
# - num_train_epochs: This specifies the number of times the entire dataset will be processed during training, similar to num_epochs.
# - weight_decay: This hyperparameter controls the amount of regularization applied to the model's parameters during training.
# - evaluation_strategy: This determines when evaluation is performed during training. "epoch" means evaluation is done after each epoch.
# - save_strategy: This specifies how often the model is saved during training. "epoch" means the model is saved after each epoch.
# - load_best_model_at_end: This determines whether to load the best model (based on evaluation performance) at the end of training.
# By defining these training arguments, we configure how the model is trained and evaluated
training_args = TrainingArguments(
    output_dir= model_checkpoint + "-lora-text-classification",
    learning_rate=lr,
    per_device_train_batch_size=batch_size,
    per_device_eval_batch_size=batch_size,
    num_train_epochs=num_epochs,
    weight_decay=0.01,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

# A Trainer object is responsible for orchestrating the training and evaluation of a machine learning model. It takes care of iterating over the training dataset, updating the model's parameters, and evaluating its performance on a separate evaluation dataset.
#
# In this code:
# - model: This is the machine learning model that will be trained and evaluated.
# - args: These are the training arguments defined earlier, which specify various settings for training and evaluation.
# - train_dataset: This is the dataset containing examples used for training the model.
# - eval_dataset: This is the dataset containing examples used for evaluating the model's performance.
# - tokenizer: This is the tokenizer object used for tokenizing input text data.
# - data_collator: This object is responsible for batching and padding tokenized inputs during training.
# - compute_metrics: This function computes evaluation metrics based on model predictions and ground truth labels.
#
# By creating this Trainer object and providing it with the necessary components, we set up the entire training and evaluation pipeline for the model.
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator, # this will dynamically pad examples in each batch to be equal length
    compute_metrics=compute_metrics,
)

def train():
    '''
    This function trains the machine learning model using the Trainer object configured earlier.
    It first trains the model using the Trainer's train() method, which iterates over the training dataset
    for the specified number of epochs, updating the model's parameters based on the training examples.
    After training, it moves the model to 'mps' (Mac parallel system) for Mac devices or 'cpu' otherwise.
    Finally, it saves the trained model as a pickle file named "sentiment_analysis".

    No parameters are required as the function uses the Trainer object and other defined variables within its scope.
    '''
    # train model
    trainer.train()
    model.to('mps') # moving to mps for Mac (can alternatively do 'cpu')

    # save the iris classification model as a pickle file
    model_pkl_file = "sentiment_analysis"

    with open(model_pkl_file, 'wb') as file:
        pickle.dump(model, file)

def test(text_list):
    '''
    This function tests the trained machine learning model using the provided list of text inputs.
    It loads the previously trained model from the saved pickle file "sentiment_analysis".
    Then, it iterates over each text in the input list, tokenizes it, and makes predictions using the loaded model.
    The predictions are printed alongside the corresponding input text.

    Parameters:
        text_list (list): A list containing text inputs to be tested by the model.
    '''

    model_pkl_file = "sentiment_analysis"

    with open(model_pkl_file, 'rb') as file:
        model = pickle.load(file)

    print("Trained model predictions:")
    print("--------------------------")

    for text in text_list:
        inputs = tokenizer.encode(text, return_tensors="pt").to(
            "mps")  # moving to mps for Mac (can alternatively do 'cpu')

        logits = model(inputs).logits
        predictions = torch.max(logits, 1).indices

        print(text + " - " + id2label[predictions.tolist()[0]])

def main():
    '''
    This function serves as the entry point for running the script.
    It checks the command-line arguments provided when running the script.
    If no arguments are provided or the argument is 'train', it initiates the training process.
    If the argument is 'predict', it prints the provided text input and performs sentiment analysis prediction on it.
    '''
    if len(sys.argv) == 1 or sys.argv[1] == 'train':
        train()
    elif sys.argv[1] == 'predict':
        print(sys.argv[2])
        test([sys.argv[2]])

if __name__ == '__main__':
    main()
import sys
from transformers import GPT2Tokenizer, GPT2ForSequenceClassification  # Import GPT2 model and tokenizer

# Define the directory where the trained model will be saved or loaded from.
output_dir = "./saved_model"

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
# Load the pre-trained GPT-2 tokenizer. This tokenizer is used to preprocess input text
# before passing it to the GPT-2 model for sentiment classification.
# Here, we're using the "gpt2" tokenizer, which corresponds to the standard GPT-2 tokenizer
# provided by the Hugging Face Transformers library.

# Load the saved model and tokenizer
loaded_model = GPT2ForSequenceClassification.from_pretrained(output_dir)

# WKeZjayt5WA3z-YX6yYa
def get_sentiment(sentence):
    """
   This function takes a sentence and predicts its sentiment using a fine-tuned GPT-2 model for sequence classification.

   Example:
       Input:
           sentence = "This is a positive review."
       Output:
           'Positive'

   Parameters:
       sentence (str): The input sentence for sentiment prediction.

   Returns:
       str: The predicted sentiment label ('Negative', 'Neutral', or 'Positive').
   """

    # Define sentiment options
    sentiment_options = ["Negative", "Neutral", "Positive"]

    # Tokenize the input sentence and convert it into PyTorch tensors
    inputs = tokenizer(sentence, return_tensors="pt")

    # Pass the tokenized input through the loaded model to get predictions
    outputs = loaded_model(**inputs)

    # Get the predicted sentiment by selecting the index with the highest probability
    prediction = outputs.logits.argmax(-1).item()

    # Map the predicted index to the corresponding sentiment label
    return sentiment_options[prediction]


def main():
    # Check if a sentence is provided as a command-line argument
    if len(sys.argv) > 1:
        sentence = sys.argv[1]
        # Call the function to get the sentiment of the provided sentence and print the result
        print(get_sentiment(sentence))


if __name__ == '__main__':
    main()

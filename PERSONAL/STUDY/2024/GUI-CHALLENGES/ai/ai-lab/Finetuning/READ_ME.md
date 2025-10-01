# Sentiment Analysis with Finetuning

This Python script utilizes a fine-tuned GPT-2 model and distilber for sentiment analysis. It predicts the sentiment of a given sentence as either 'Negative', 'Neutral', or 'Positive'. Below are the details and instructions for using this script:

1. Prerequisites:
   - Python
   - Install the libraries that are needed.
     1. Create a virtual environment: `python3 -m venv venv`
     2. Activate virtual environment: `source venv/bin/activate`
     3. Install libraries: `pip install -r requirements.txt`

**Distilbert** - `finetuning.py`: This is the Python script for testing and or finetuning a distilber model.

2. Usage:

   - Ensure that the prerequisites are installed.
   - An already finetuned instances (sentiment_analysis) is in the files.
   - You can finetune the model yourself by running `python finetuning.py train` : the model be finetuned
   - If you want to test your finetuned model than run `python finetuning.py predict "TEST"`
   - You can use whatever sentence or word you like, just replace the TEST
   - You get the sentiment of the sentence you provided.

3. Training process

   - Setting Up Tools: We're setting up the tools needed to analyze sentiment in tweets, like a special library for handling data and another one for using advanced language models.
   - Preparing Data: We're preparing the tweets for analysis by converting them into a format the computer can understand, using a process called tokenization. It's like breaking down the tweets into smaller parts and assigning numbers to them.
   - Data Processing: After breaking down the tweets, we're organizing them and making sure they're all the same size. This helps the computer process them more efficiently.
   - Initial Training Data: We're selecting a smaller subset of the tweets to train the model initially. This helps speed up the training process while still providing diverse examples for the model to learn from.
   - Model Setup: We're setting up a language model called distlibert to classify tweets into three categories: positive or negative.
   - Metric for Evaluation: We're setting up a way to measure how accurate our model's predictions are. In this case, we're using accuracy, which tells us the percentage of correct predictions made by the model.
   - Training Configuration: We're configuring how the model will be trained, including details like batch size, which determines how many examples are processed at once during training.
   - Starting Training Finetuning: Now, we're actually teaching the model by showing it lots of examples and adjusting its parameters to minimize errors.
   - Checking Model's Understanding: We're checking how well the model understands tweets after some initial training, to see if it's on the right track.
   - Saving Progress: We're saving the model's progress so far, which includes its parameters and configuration, so we can pick up where we left off if needed.
   - Further Training: We're continuing to train the model to improve its understanding of tweets by adjusting its parameters based on feedback from more examples.
   - Final Evaluation: We're evaluating the model's performance again after further training to see how much it's improved.
   - Saving the Trained Model: We're saving the trained model so we can use it later without having to train it again from scratch.
   - Final Check: We're doing one last check to ensure the model's performance meets our expectations before we finish.

4. Prediction process
   - Input Text: We receive a new tweet that we want to analyze for sentiment. This tweet can be in any language and can contain emojis, slang, or abbreviations.
   - Text Preprocessing: Before making predictions, we preprocess the tweet by tokenizing it, removing any unnecessary characters or symbols, and converting it into a format compatible with our model.
   - Sentiment Analysis: Using our finetuned language model, we analyze the preprocessed tweet to determine its sentiment. The model assigns a probability score to each sentiment category (positive, neutral).
   - Predicted Sentiment: Based on the highest probability score among the sentiment categories, we classify the tweet as either positive or negative
   - Output: The predicted sentiment of the tweet is then provided as the final output, along with the probability scores for each sentiment category for transparency and further analysis if needed.

**GTP-2 model** - `finetuningLLM.py`: This is the Python script for finetuning the GPT-2 model. - `load_finetuned_model.py`: This is the Python script for loading the finetuned model and test it.

2. Usage:

   - Ensure that the prerequisites are installed.
   - **NOTE: No training is needed, if no new dataset is used, since the model is already finetuned on the existing dataset.**
   - Only if you want to finetune using a new dataset, read the "For training". Otherwise, go the for testing part.
   - For training:
     - Run `python finetuningLLM.py`.
     - This will take an hour. You will only need to run the training script if the is not done already.
     - It will save a model automatically in de directory `saved_model`.
   - For testing:
     - Run the script by providing a sentence as a command-line argument.
     - Example: `python load_finetuned_model.py "This is a positive review."`
     - You can replace the "This is a positive review" with any other sentence, but please make sure it is between "".
     - The script will output the predicted sentiment label.

3. Training Process (`finetuningLLM.py`):

   - The script loads a sentiment analysis dataset from Twitter using the `load_dataset` function from the `datasets` library.
   - It initializes a GPT-2 tokenizer and tokenizes the dataset using a tokenization function.
   - A smaller subset of the training and evaluation datasets is prepared for faster training.
   - The GPT-2 model is initialized for sequence classification with three labels (positive, negative, neutral).
   - Evaluation metric (accuracy) is loaded to measure the model's performance.
   - Training arguments are configured to set up the training process, including batch sizes and gradient accumulation steps.
   - A Trainer object is initialized to facilitate training with the specified model, training arguments, datasets, and evaluation metric.
   - The performance of the pre-trained model on the evaluation dataset is evaluated before fine-tuning.
   - The trained model is saved to a specified directory for later use. Saving the model allows reusability without retraining.

4. Prediction Process (`load_finetuned_model.py`):

   - The script loads a fine-tuned GPT-2 model for sentiment classification.
   - It tokenizes the input sentence and passes it through the model to predict the sentiment.
   - The predicted sentiment label ('Negative', 'Neutral', or 'Positive') is returned.

5. Credits:

   - This script utilizes the Hugging Face Transformers library for working with GPT-2 models.

6. Biases:
   - The sentiment analysis model may reflect biases present in its training data, such as demographic or label biases. These biases can lead to inaccuracies in sentiment predictions, especially across diverse groups. To mitigate bias, it's important to ensure that the training data is diverse and representative of all demographics. Users should interpret results with caution and consider the potential impact of biases on their applications.

For any questions or issues, please contact the script author (Philline Dikker).

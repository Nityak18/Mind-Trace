import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import classification_report

# Setup directory for models
os.makedirs('../backend/saved_models', exist_ok=True)
os.makedirs('../data', exist_ok=True)

def create_sample_data():
    """Create a small dummy dataset if the real one isn't found."""
    data = {
        'text': [
            "I feel so sad and lonely all the time",
            "There is no hope for my future",
            "I can't stop worrying about what might happen",
            "I had a panic attack at work today",
            "I am feeling very overwhelmed with my deadlines",
            "Everything is fine, I am happy",
            "I had a great day at the park",
            "I keep having flashbacks to that accident",
            "My mood swings are hard to control lately",
            "I feel a lot of pressure from my boss"
        ],
        'label': [
            "Depression", "Depression", "Anxiety", "Anxiety", "Stress", 
            "Normal", "Normal", "PTSD", "Bipolar", "Stress"
        ]
    }
    df = pd.DataFrame(data)
    df.to_csv('../data/sample_mental_health.csv', index=False)
    return df

def train_svm():
    print("--- Training SVM Model ---")
    data_path = '../data/sample_mental_health.csv'
    
    if not os.path.exists(data_path):
        print("Dataset not found. Creating sample data...")
        df = create_sample_data()
    else:
        df = pd.read_csv(data_path)
    
    X = df['text']
    y = df['label']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Vectorize
    vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train
    print(f"Training on {len(X_train)} samples...")
    model = SVC(kernel='linear', C=1.0, probability=True)
    model.fit(X_train_vec, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_vec)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save
    with open('../backend/saved_models/svm_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('../backend/saved_models/tfidf_vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
        
    print("SVM model and vectorizer saved to backend/saved_models/")

if __name__ == "__main__":
    train_svm()
    print("\nNote: For DistilBERT and LSTM, you would follow similar steps using transformers and tensorflow libraries respectively.")

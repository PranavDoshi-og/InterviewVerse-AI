from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class InterviewRequest(BaseModel):
    answer: str
    role: str


class FeedbackRequest(BaseModel):
    messages: list


@app.get("/")
def home():
    return {"message": "Backend running"}


@app.post("/generate-question")
def generate_question(data: InterviewRequest):

    prompt = f"""
    You are an AI interviewer for a {data.role} role.

    Candidate answer:
    {data.answer}

    Ask the next interview question only.
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        },
    )

    result = response.json()

    print("OPENROUTER RESPONSE:")
    print(result)

    # ERROR HANDLING
    if "choices" not in result:

        return {
            "question": f"API Error: {result}"
        }

    question = result["choices"][0]["message"]["content"]

    return {
        "question": question
    }


@app.post("/generate-feedback")
def generate_feedback(data: FeedbackRequest):

    prompt = f"""
    You are an expert technical interviewer.

    Analyze this interview conversation deeply.

    Interview Conversation:
    {data.messages}

    Evaluate:
    - technical knowledge
    - communication
    - confidence
    - problem solving
    - project understanding

    Generate a COMPLETE interview report in STRICT JSON format.

    Return ONLY valid JSON.

    Format:

    {{
      "overall_score": number,
      "technical_score": number,
      "communication_score": number,
      "problem_solving_score": number,
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "final_feedback": "detailed final evaluation"
    }}
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        },
    )

    result = response.json()

    print(result)

    if "choices" not in result:

        return {
            "overall_score": 0,
            "technical_score": 0,
            "communication_score": 0,
            "problem_solving_score": 0,
            "strengths": ["API Error"],
            "improvements": ["Check API key"],
            "final_feedback": str(result)
        }

    content = result["choices"][0]["message"]["content"]

    # Remove markdown formatting if AI adds it
    content = content.replace("```json", "")
    content = content.replace("```", "")

    feedback = json.loads(content)

    return feedback
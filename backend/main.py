from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
import fitz
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

print("API KEY:", OPENROUTER_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# GLOBAL RESUME STORAGE
# =========================
resume_text = ""


# =========================
# REQUEST MODELS
# =========================
class InterviewRequest(BaseModel):
    answer: str
    role: str


class FeedbackRequest(BaseModel):
    messages: list


# =========================
# HOME ROUTE
# =========================
@app.get("/")
def home():
    return {
        "message": "Backend running"
    }


# =========================
# RESUME UPLOAD API
# =========================
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    global resume_text

    pdf_bytes = await file.read()

    doc = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    extracted_text = ""

    for page in doc:
        extracted_text += page.get_text()

    resume_text = extracted_text

    print("RESUME EXTRACTED")

    return {
        "message": "Resume uploaded successfully",
        "resume_text": resume_text[:2000]
    }


# =========================
# GENERATE QUESTION
# =========================
@app.post("/generate-question")
def generate_question(data: InterviewRequest):

    global resume_text

    prompt = f"""
    You are an expert AI interviewer for a {data.role} role.

    Candidate Resume:
    {resume_text}

    Candidate Answer:
    {data.answer}

    Rules:
    - Ask personalized interview questions
    - Use resume projects and skills
    - Ask technical follow-ups
    - Be conversational
    - Ask only ONE question

    Generate the next interview question only.
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

    print("QUESTION RESPONSE:")
    print(result)

    if "choices" not in result:

        return {
            "question": f"API Error: {result}"
        }

    question = result["choices"][0]["message"]["content"]

    return {
        "question": question
    }


# =========================
# GENERATE FEEDBACK
# =========================
@app.post("/generate-feedback")
def generate_feedback(data: FeedbackRequest):

    global resume_text

    prompt = f"""
    You are an expert technical interviewer.

    Candidate Resume:
    {resume_text}

    Interview Conversation:
    {data.messages}

    Analyze deeply:
    - technical knowledge
    - frontend/backend understanding
    - communication
    - confidence
    - project understanding
    - resume relevance
    - career readiness
    - problem solving ability

    Also generate:
    - personalized improvement roadmap
    - recommended topics to learn
    - suggested learning resources
    - career growth suggestions

    IMPORTANT:
    - All scores must be integers between 0 and 100.
    - Do NOT use a 1-10 scale.
    - Average candidates should score between 60 and 75.
    - Strong candidates should score between 75 and 90.
    - Excellent candidates should score between 90 and 100.
    - Evaluate realistically based on the interview conversation.

    Return ONLY valid JSON in this format:

    {{
      "overall_score": 0,
      "technical_score": 0,
      "communication_score": 0,
      "problem_solving_score": 0,

      "strengths": [
        "strength1",
        "strength2"
      ],

      "improvements": [
        "improvement1",
        "improvement2"
      ],

      "recommended_topics": [
        "topic1",
        "topic2"
      ],

      "learning_resources": [
        "resource1",
        "resource2"
      ],

      "career_roadmap": [
        "step1",
        "step2",
        "step3"
      ],

      "final_feedback": "detailed evaluation"
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

    print("FEEDBACK RESPONSE:")
    print(result)

    if "choices" not in result:

        return {
            "overall_score": 0,
            "technical_score": 0,
            "communication_score": 0,
            "problem_solving_score": 0,
            "strengths": ["API Error"],
            "improvements": ["Check API key"],
            "recommended_topics": [],
            "learning_resources": [],
            "career_roadmap": [],
            "final_feedback": str(result)
        }

    content = result["choices"][0]["message"]["content"]
    print("RAW AI CONTENT:")
    print(content)
    # Remove markdown if AI adds it
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:
        feedback = json.loads(content)

    except Exception as e:

        print("JSON ERROR:", e)

        return {
            "overall_score": 70,
            "technical_score": 70,
            "communication_score": 70,
            "problem_solving_score": 70,
            "strengths": ["Good participation"],
            "improvements": ["Improve answer quality"],
            "recommended_topics": [],
            "learning_resources": [],
            "career_roadmap": [],
            "final_feedback": "Unable to parse AI response."
        }

    return feedback
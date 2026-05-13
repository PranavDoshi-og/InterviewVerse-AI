from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import UploadFile, File
import fitz
import os

# Load environment variables
load_dotenv()

# OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class InterviewRequest(BaseModel):
    role: str
    messages: list

# API endpoint
# Resume Upload Route
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        pdf = fitz.open(stream=contents, filetype="pdf")

        extracted_text = ""

        for page in pdf:
            extracted_text += page.get_text()

        return {
            "resume_text": extracted_text
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "resume_text": ""
        }


# AI Interview Route
@app.post("/generate-question")
async def generate_question(data: InterviewRequest):

    conversation = ""

    for msg in data.messages:

        msg_type = msg.get("type", "")
        msg_text = msg.get("text", "")

        conversation += f"{msg_type}: {msg_text}\n"

    prompt = f"""
    You are a professional interviewer hiring for a {data.role} role.

    Conversation history:
    {conversation}

    Rules:
    - Ask only ONE interview question
    - Ask intelligent follow-up questions
    - Refer to previous answers
    - Avoid repeating questions
    """

    try:

        completion = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",

            messages=[
                {
                    "role": "system",
                    "content": "You are an expert interviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        generated_question = completion.choices[0].message.content

        return {
            "question": generated_question
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "question": "Error generating question."
        }
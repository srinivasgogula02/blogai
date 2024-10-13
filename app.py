import os

from groq import Groq

client = Groq(
    api_key="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",
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "write a blog pregnancy give output in json format with fields title and content in markdown, only give json no other text outside it",
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)
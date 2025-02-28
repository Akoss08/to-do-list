from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from sqlalchemy.exc import StatementError

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")

app.config["SQLALCHEMY_DATABASE_URI"] = url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Todo(db.Model):
    __tablename__ = "to_do_list"

    id = db.Column(db.Integer, primary_key=True)
    to_do = db.Column(db.Text, nullable=False)
    creation_time = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.now(timezone.utc),
    )
    is_done = db.Column(db.Boolean, default=False)


@app.get("/api/todos")
def get_all_todos():
    try:
        all_todos = (
            db.session.query(Todo)
            .order_by(Todo.is_done, Todo.creation_time)
            .all()
        )
        todos_list = [
            {
                "id": todo.id,
                "to_do": todo.to_do,
                "creation_time": todo.creation_time,
                "is_done": todo.is_done,
            }
        )

    return jsonify(todos_list)


if __name__ == "__main__":
    app.run(debug=True)

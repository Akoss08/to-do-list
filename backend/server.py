from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from sqlalchemy.exc import StatementError

load_dotenv()

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")
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
            for todo in all_todos
        ]

        return jsonify(todos_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/todos")
def add_to_do():
    try:
        new_todo = request.get_json()

        if not new_todo["to_do"].strip():
            raise KeyError

        to_do = Todo(to_do=new_todo["to_do"])

        db.session.add(to_do)
        db.session.commit()

        return jsonify({"new_to_do_id": to_do.id}), 201
    except KeyError:
        return jsonify({"error": "'to_do' key and its value is required"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.patch("/api/todos/<int:id>")
def update_to_do(id):
    try:
        update = request.get_json()

        if not update:
            raise KeyError("request body required")

        if "to_do" in update.keys() and not update["to_do"].strip():
            raise KeyError("to_do cannot be empty")

        todo_to_update = Todo.query.get_or_404(
            id, description=f"to-do with id {id} not found"
        )

        immutable_fields = {"id", "creation_time"}

        for key, value in update.items():
            if key not in immutable_fields:
                setattr(todo_to_update, key, value)

        db.session.commit()

        return jsonify({"updated_todo_id": todo_to_update.id})
    except StatementError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid request value: {str(e)}"}), 400
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.delete("/api/todos/<int:id>")
def delete_to_do(id):
    try:
        todo_to_delete = Todo.query.get_or_404(
            id, description=f"to-do with id {id} not found"
        )

        db.session.delete(todo_to_delete)
        db.session.commit()

        return jsonify({"successfully_deleted_id": todo_to_delete.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.get("/api/todos/<int:id>")
def get_to_do_by_id(id):
    try:
        to_do = Todo.query.get_or_404(
            id, description=f"to-do with id {id} not found"
        )

        return jsonify(
            {
                "id": to_do.id,
                "to_do": to_do.to_do,
                "creation_time": to_do.creation_time,
                "is_done": to_do.is_done,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

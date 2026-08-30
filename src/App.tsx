import { useState, useEffect, FormEvent } from "react";
import "./App.css";

// Todoの型を定義
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  // ローカルストレージから初期値を読み込む（リロードしてもタスクが消えない）
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? (JSON.parse(savedTodos) as Todo[]) : [];
  });

  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // todosが変わるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // タスク追加
  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputText("");
  };

  // タスク削除
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 完了切り替え（打ち消し線用）
  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 編集開始
  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // 編集保存
  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // 残りのタスク数
  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app-container">
      <h1>✅ My Tasks</h1>
      <p className="task-count">
        {todos.length === 0
          ? "タスクはまだありません。上の入力欄から追加しましょう！"
          : remaining === 0
          ? "すべてのタスクが完了です！🎉"
          : `残り ${remaining} 件 / 全 ${todos.length} 件のタスク`}
      </p>

      {/* 入力フォーム */}
      <form onSubmit={handleAddTodo} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="新しいタスクを入力..."
        />
        <button type="submit">追加</button>
      </form>

      {/* タスク一覧 */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            {editingId === todo.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(todo.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  autoFocus
                />
                <button type="button" onClick={() => handleSaveEdit(todo.id)}>
                  保存
                </button>
                <button type="button" onClick={handleCancelEdit}>
                  キャンセル
                </button>
              </div>
            ) : (
              <>
                {/* 完了フラグ（チェックボックス） */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className="todo-checkbox"
                />

                <span className="todo-text">{todo.text}</span>

                <button
                  type="button"
                  onClick={() => handleStartEdit(todo)}
                  className="btn-edit"
                >
                  編集
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="btn-delete"
                >
                  削除
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

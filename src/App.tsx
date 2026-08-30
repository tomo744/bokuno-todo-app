import { useState } from "react";
import type { FormEvent } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (text === "") return;
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            ✅ My Tasks
          </h1>
          <p className="text-gray-500 mt-2">
            {remaining === 0
              ? "タスクはすべて完了です！"
              : `残り ${remaining} 件のタスクがあります`}
          </p>
        </header>
        <form
          onSubmit={addTask}
          className="flex gap-2 bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold px-5 py-2 rounded-xl transition"
          >
            追加
          </button>
        </form>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-md px-4 py-3 hover:shadow-lg transition"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 accent-indigo-500 cursor-pointer"
              />
              <span
                className={`flex-1 text-gray-800 ${
                  task.done ? "line-through text-gray-400" : ""
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 text-sm font-medium transition"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 bg-white/60 rounded-2xl py-10 border border-dashed border-gray-300">
            タスクはまだありません。上の入力欄から追加しましょう！
          </p>
        )}
      </div>
    </div>
  );
}

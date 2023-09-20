import { useState } from "preact/hooks";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

export default function Anser() {
  const [problem, setProblem] = useState(""); // 問題文の入力を受け付けるステート
  const [answer, setAnswer] = useState(""); // 答えを表示するステート

  // APIから答えを取得する関数
  const fetchAnswer = async () => {
    try {
      const response = await axiod.get(
        `/api/answer?problem=${encodeURIComponent(problem)}`,
      );
      const data = await response.data;
      setAnswer(data);
    } catch (error) {
      console.error(error);
      setAnswer("エラーが発生しました。");
    }
  };

  return (
    <div class="flex justify-center item-center h-screen">
      <div class="max-w-lg m-auto w-full flex-1 p-4 flex flex-col ">
        <h1 class="text-2xl font-semibold mb-4">問題文から検索</h1>
        <textarea
          class="w-full h-24 p-2 border border-black"
          placeholder="問題文を入力してください"
          value={problem}
          onInput={(e) => {
            if (e.target instanceof HTMLTextAreaElement) {
              setProblem(e.target.value);
            }
          }}
        >
        </textarea>
        <button
          class="mt-2 bg-black text-white px-4 py-2 hover:bg-gray-700 transition-all duration-200 ease-out"
          onClick={fetchAnswer}
        >
          答えを検索
        </button>
        {answer && (
          <div class="mt-4">
            <strong>答え:</strong> {answer}
          </div>
        )}
      </div>
    </div>
  );
}

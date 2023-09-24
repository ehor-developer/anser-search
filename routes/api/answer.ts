import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export const handler = async (
  req: Request,
): Promise<Response> => {
  try {
    const params = new URLSearchParams(
      req.url.substring(req.url.indexOf("?") + 1),
    );
    const problem = params.get("problem");

    if (!problem) {
      return new Response("問題文を指定してください。", { status: 400 });
    }

    const answer = await scrapeAnswer(problem);

    if (answer) {
      return new Response(answer);
    } else {
      return new Response("答えが見つかりませんでした。", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response("エラーが発生しました。", { status: 500 });
  }
};

async function scrapeAnswer(problem: string): Promise<string | null> {
  const searchUrl = `https://quizlet.com/search?query=${encodeURIComponent(problem)}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  };

  try {
    const response = await axiod.get(searchUrl, { headers });
    const html = response.data;

    // HTMLを解析
    const document = new DOMParser().parseFromString(html, "text/html");

    // 非表示（hidden）の要素を除外して、答えを抽出
    const answerElement = document?.querySelector(
      ".TermPreviewCard-definition > div:not([hidden])",
    );

    if (answerElement) {
      const answer = answerElement.textContent?.trim() || "答えが見つかりませんでした";
      return answer;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

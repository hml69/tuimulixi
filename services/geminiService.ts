
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTetWish = async (amount: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Hãy viết một câu chúc Tết ngắn gọn, vui nhộn và ý nghĩa cho người vừa nhận được lì xì ${amount.toLocaleString('vi-VN')} VNĐ. Câu chúc nên mang âm hưởng Tết Giáp Thìn 2024 hoặc Ất Tỵ 2025.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Chúc bạn một năm mới an khang thịnh vượng, vạn sự như ý!";
  } catch (error) {
    console.error("Error generating wish:", error);
    return "Chúc mừng năm mới! Phát tài phát lộc, tiền vô như nước!";
  }
};

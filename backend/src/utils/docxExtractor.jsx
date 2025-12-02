import { readDocx } from "docx";

export const extractDocxText = async (buffer) => {
  const doc = await readDocx(buffer);
  return doc.getText();
};

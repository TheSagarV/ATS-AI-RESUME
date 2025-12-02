export function parseResumeSections(text) {
  const cleaned = text.replace(/\n{2,}/g, "\n").trim();

  const section = (label) => {
    const regex = new RegExp(`${label}[:\\s\\n]+([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]{2,}:|$)`, "i");
    const match = cleaned.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    fullName: cleaned.split("\n")[0] || "",
    email: (cleaned.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [""])[0],
    phone: (cleaned.match(/(\+?\d[\d -]{8,})/) || [""])[0],

    summary: section("Summary") || section("Objective"),
    skills: section("Skills"),
    experience: section("Experience") || section("Work History"),
    education: section("Education")
  };
}

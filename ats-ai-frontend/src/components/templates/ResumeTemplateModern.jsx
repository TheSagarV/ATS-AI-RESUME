import React from "react";

const ResumeTemplateModern = ({ data }) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;

  const fontStyle = {
    fontFamily: design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'ui-sans-serif, system-ui, sans-serif',
    fontSize: design?.size === 'small' ? '0.7rem' : design?.size === 'large' ? '0.9rem' : '0.8rem',
  };

  const headerColor = { color: design?.color || '#0f172a' };

  const formatList = (content) => {
    if (!content) return null;

    let items = [];
    if (Array.isArray(content)) {
      items = content;
    } else if (typeof content === 'string') {
      items = content.split('\n').filter(line => line.trim());
    }

    if (items.length === 0) return null;

    if (items.length === 1 && !items[0].trim().match(/^[-•*]/)) {
      return <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>{items[0]}</p>;
    }

    return (
      <ul className="list-disc list-outside ml-4 leading-relaxed space-y-0.5" style={{ color: design?.textColor || '#334155' }}>
        {items.map((item, i) => (
          <li key={i} className="pl-1">{item.replace(/^[-•*]\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  const renderSection = (id) => {
    if (id === "summary") {
      return (
        <div key={id} className="mb-5">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-wider" style={headerColor}>Summary</h2>
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>{summary || "Short summary focusing on impact and key achievements."}</p>
        </div>
      );
    }
    if (id === "experience") {
      return (
        <div key={id} className="mb-5">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-wider" style={headerColor}>Experience</h2>
          {formatList((experience && experience.length > 0) ? experience : "Describe your roles with bullet points.")}
        </div>
      );
    }
    if (id === "education") {
      return (
        <div key={id} className="mb-5">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-wider" style={headerColor}>Education</h2>
          {formatList((education && education.length > 0) ? education : "Universities, degrees, and graduation years.")}
        </div>
      );
    }
    if (id.startsWith("custom-")) {
      const section = (data.customSections || []).find(s => s.id === id);
      if (!section) return null;
      return (
        <div key={id} className="mb-5">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-wider" style={headerColor}>{section.title}</h2>
          {formatList(section.content)}
        </div>
      );
    }
    return null;
  };

  // For Modern template, we keep Skills in sidebar for design consistency, 
  // but allow other sections to be reordered in the main column.
  const order = (data.sectionOrder && data.sectionOrder.length > 0) ? data.sectionOrder : ["summary", "experience", "education"];

  return (
    <div className="grid grid-cols-9 gap-6 break-words p-8" style={{ ...fontStyle, color: design?.textColor || '#334155' }}>
      <aside className="col-span-4 bg-slate-100 px-5 py-6 rounded-lg overflow-hidden">
        <h1 className="text-[1.5em] font-semibold mb-1 break-words" style={headerColor}>{fullName || "Your Name"}</h1>
        {title && <p className="text-[1.1em] mb-2 font-medium" style={{ color: design?.textColor || '#475569' }}>{title}</p>}
        <div className="text-[0.9em] mb-4 break-words flex flex-wrap gap-2 items-center" style={{ color: design?.textColor || '#475569' }}>
          {[
            { value: email, type: 'email' },
            { value: phone, type: 'phone' },
            { value: location, type: 'location' },
            { value: github, type: 'url' },
            { value: linkedin, type: 'url' }
          ].filter(item => item.value).map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>•</span>}
              <a
                href={
                  item.type === 'email' ? `mailto:${item.value}` :
                    item.type === 'phone' ? `tel:${item.value}` :
                      item.type === 'location' ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.value)}` :
                        item.value.startsWith('http') ? item.value : `https://${item.value}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-cyan-600 transition-colors"
                style={{ color: 'inherit' }}
              >
                {item.value}
              </a>
            </React.Fragment>
          ))}
        </div>

        <h2 className="font-semibold text-[1.1em] mb-1" style={headerColor}>Skills</h2>
        <div className="break-words">
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>
            {(Array.isArray(skills) && skills.length > 0) ? skills.join(", ") : "List your key skills here"}
          </p>
        </div>
      </aside>

      <main className="col-span-5 overflow-hidden">
        {order.filter(id => id !== "skills").map(id => renderSection(id))}
      </main>
    </div>
  );
};

export default ResumeTemplateModern;

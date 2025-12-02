import React from "react";

const ResumeTemplateClassic = ({ data }) => {
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

    // If it's just one line and doesn't look like a list item, return paragraph
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
        <div key={id} className="mb-4">
          <h2 className="font-bold text-[1.1em] mb-2 border-b border-slate-300 pb-1" style={headerColor}>Summary</h2>
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>{summary || "Add a short professional summary tailored to your target job."}</p>
        </div>
      );
    }
    if (id === "skills") {
      return (
        <div key={id} className="mb-4">
          <h2 className="font-bold text-[1.1em] mb-2 border-b border-slate-300 pb-1" style={headerColor}>Skills</h2>
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>
            {(Array.isArray(skills) && skills.length > 0) ? skills.join(", ") : "List your key skills."}
          </p>
        </div>
      );
    }
    if (id === "experience") {
      return (
        <div key={id} className="mb-4">
          <h2 className="font-bold text-[1.1em] mb-2 border-b border-slate-300 pb-1" style={headerColor}>Experience</h2>
          {formatList((experience && experience.length > 0) ? experience : "Add your most relevant roles and achievements.")}
        </div>
      );
    }
    if (id === "education") {
      return (
        <div key={id} className="mb-4">
          <h2 className="font-bold text-[1.1em] mb-2 border-b border-slate-300 pb-1" style={headerColor}>Education</h2>
          {formatList((education && education.length > 0) ? education : "Add your degrees, institutions and years.")}
        </div>
      );
    }
    if (id.startsWith("custom-")) {
      const section = (data.customSections || []).find(s => s.id === id);
      if (!section) return null;
      return (
        <div key={id} className="mb-4">
          <h2 className="font-bold text-[1.1em] mb-2 border-b border-slate-300 pb-1" style={headerColor}>{section.title}</h2>
          {formatList(section.content)}
        </div>
      );
    }
    return null;
  };

  const order = (data.sectionOrder && data.sectionOrder.length > 0) ? data.sectionOrder : ["summary", "skills", "experience", "education"];

  return (
    <div className="text-slate-900 leading-relaxed p-8" style={fontStyle}>
      <h1 className="text-[1.8em] font-semibold mb-1" style={headerColor}>{fullName || "Your Name"}</h1>
      {title && <p className="text-[1.1em] mb-1 font-medium" style={{ color: design?.textColor || '#475569' }}>{title}</p>}
      <div className="text-[0.9em] mb-4 text-slate-600 flex flex-wrap gap-2 items-center">
        {[
          { value: email, type: 'email' },
          { value: phone, type: 'phone' },
          { value: location, type: 'location' },
          { value: github, type: 'url' },
          { value: linkedin, type: 'url' }
        ].filter(item => item.value).map((item, index, arr) => (
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

      {order.map(id => renderSection(id))}
    </div>
  );
};

export default ResumeTemplateClassic;

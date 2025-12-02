import React from "react";

const ResumeTemplateMinimal = ({ data }) => {
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
        <section key={id} className="mb-6">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style={headerColor}>Summary</h2>
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>{summary || "Summary about your profile"}</p>
        </section>
      );
    }
    if (id === "skills") {
      return (
        <section key={id} className="mb-6">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style={headerColor}>Skills</h2>
          <p className="leading-relaxed" style={{ color: design?.textColor || '#334155' }}>
            {(Array.isArray(skills) && skills.length > 0) ? skills.join(", ") : "Skills listed here"}
          </p>
        </section>
      );
    }
    if (id === "experience") {
      return (
        <section key={id} className="mb-6">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style={headerColor}>Experience</h2>
          {formatList((experience && experience.length > 0) ? experience : "Your work experience goes here")}
        </section>
      );
    }
    if (id === "education") {
      return (
        <section key={id} className="mb-6">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style={headerColor}>Education</h2>
          {formatList((education && education.length > 0) ? education : "Education history here")}
        </section>
      );
    }
    if (id.startsWith("custom-")) {
      const section = (data.customSections || []).find(s => s.id === id);
      if (!section) return null;
      return (
        <section key={id} className="mb-6">
          <h2 className="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style={headerColor}>{section.title}</h2>
          {formatList(section.content)}
        </section>
      );
    }
    return null;
  };

  const order = (data.sectionOrder && data.sectionOrder.length > 0) ? data.sectionOrder : ["summary", "skills", "experience", "education"];

  return (
    <div className="leading-relaxed p-8" style={{ ...fontStyle, color: design?.textColor || '#334155' }}>
      <header className="border-b border-slate-300 pb-2 mb-3">
        <h1 className="text-[1.8em] font-semibold tracking-wide" style={headerColor}>{fullName || "Your Name"}</h1>
        {title && <p className="text-[1.1em] mb-1 font-medium" style={{ color: design?.textColor || '#475569' }}>{title}</p>}
        <div className="text-[0.9em] mb-6 text-slate-500 flex flex-wrap gap-2 items-center">
          {[
            { value: email, type: 'email' },
            { value: phone, type: 'phone' },
            { value: location, type: 'location' },
            { value: github, type: 'url' },
            { value: linkedin, type: 'url' }
          ].filter(item => item.value).map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>|</span>}
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
      </header>

      {order.map(id => renderSection(id))}
    </div>
  );
};

export default ResumeTemplateMinimal;



export const getClassicTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;

  // Design Logic
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'ui-sans-serif, system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '0.7rem' : design?.size === 'large' ? '0.9rem' : '0.8rem';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const formatList = (items) => {
    if (!items) return '';
    if (typeof items === 'string') {
      return items.split('\n').filter(l => l.trim()).map(l => `<li class="pl-1">${l.replace(/^[-•*]\s*/, '')}</li>`).join('');
    }
    if (Array.isArray(items)) {
      return items.map(item => {
        if (typeof item === 'string') return `<li class="pl-1">${item.replace(/^[-•*]\s*/, '')}</li>`;
        const title = item.title || item.degree;
        const subtitle = item.company || item.institution;
        const date = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        const desc = item.description || (item.gpa ? `GPA: ${item.gpa}` : "");

        return `
          <div class="mb-3">
            <div class="flex justify-between items-baseline">
              ${title ? `<h3 class="font-bold" style="color: ${headerColor}">${title}</h3>` : ''}
              ${date ? `<span class="text-sm whitespace-nowrap ml-4" style="color: ${textColor}">${date}</span>` : ''}
            </div>
            ${subtitle ? `<div class="text-sm italic mb-1" style="color: ${textColor}">${subtitle}</div>` : ''}
            ${desc ? `<p class="text-sm whitespace-pre-line" style="color: ${textColor}">${desc}</p>` : ''}
          </div>
        `;
      }).join('');
    }
    return '';
  };

  const renderSection = (id) => {
    if (id === 'summary' && summary) {
      return `
        <section class="mb-6">
          <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">Summary</h2>
          <p class="leading-relaxed" style="color: ${textColor}">${summary}</p>
        </section>
      `;
    }
    if (id === 'skills' && skills && skills.length > 0) {
      return `
        <section class="mb-6">
          <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">Skills</h2>
          <p class="leading-relaxed" style="color: ${textColor}">${Array.isArray(skills) ? skills.join(", ") : skills}</p>
        </section>
      `;
    }
    if (id === 'experience' && experience && experience.length > 0) {
      return `
        <section class="mb-6">
          <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">Experience</h2>
          <div style="color: ${textColor}">${formatList(experience)}</div>
        </section>
      `;
    }
    if (id === 'education' && education && education.length > 0) {
      return `
        <section class="mb-6">
          <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">Education</h2>
          <div style="color: ${textColor}">${formatList(education)}</div>
        </section>
      `;
    }
    if (id.startsWith('custom-')) {
      const section = (data.customSections || []).find(s => s.id === id);
      if (section) {
        return `
          <section class="mb-6">
            <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">${section.title}</h2>
            <div style="color: ${textColor}">
               <ul class="list-disc list-outside ml-4 space-y-1">
                 ${formatList(section.content)}
               </ul>
            </div>
          </section>
        `;
      }
    }
    return '';
  };

  const order = data.sectionOrder || ["summary", "skills", "experience", "education"];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { 
            font-family: ${fontFamily}; 
            font-size: ${fontSize};
            color: ${textColor};
            -webkit-print-color-adjust: exact; 
        }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto">
      <header class="border-b border-gray-300 pb-4 mb-6">
        <h1 class="text-[1.8em] font-bold mb-1" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        ${title ? `<p class="text-[1.1em] font-medium mb-2" style="color: ${textColor}">${title}</p>` : ''}
        <div class="text-[0.9em] flex flex-wrap gap-2 items-center" style="color: ${textColor}">
          ${contactLinks.map((link, i) => `
            ${i > 0 ? '<span>•</span>' : ''}
            <a href="${link.href}" class="hover:text-blue-600">${link.value}</a>
          `).join('')}
        </div>
      </header>
      
      ${order.map(id => renderSection(id)).join('')}
      
      ${(!data.sectionOrder && data.customSections) ? data.customSections.map(s => `
          <section class="mb-6">
            <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-gray-300 pb-1" style="color: ${headerColor}">${s.title}</h2>
            <div style="color: ${textColor}"><ul class="list-disc list-outside ml-4 space-y-1">${formatList(s.content)}</ul></div>
          </section>
      `).join('') : ''}
    </body>
    </html>
  `;
};

export const getModernTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;

  // Design Logic
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'ui-sans-serif, system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '0.7rem' : design?.size === 'large' ? '0.9rem' : '0.8rem';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const formatList = (items) => {
    if (!items) return '';
    if (typeof items === 'string') return items.split('\n').filter(l => l.trim()).map(l => `<li class="pl-1">${l.replace(/^[-•*]\s*/, '')}</li>`).join('');
    if (Array.isArray(items)) {
      return items.map(item => {
        if (typeof item === 'string') return `<li class="pl-1">${item.replace(/^[-•*]\s*/, '')}</li>`;
        const title = item.title || item.degree;
        const subtitle = item.company || item.institution;
        const date = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        const desc = item.description || (item.gpa ? `GPA: ${item.gpa}` : "");
        return `
            <div class="mb-4">
              <h3 class="font-bold" style="color: ${headerColor}">${title}</h3>
              <div class="text-sm italic mb-1" style="color: ${textColor}">${subtitle} ${date ? `| ${date}` : ''}</div>
              ${desc ? `<p class="text-sm whitespace-pre-line" style="color: ${textColor}">${desc}</p>` : ''}
            </div>
          `;
      }).join('');
    }
    return '';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { 
            font-family: ${fontFamily}; 
            font-size: ${fontSize};
            color: ${textColor};
            -webkit-print-color-adjust: exact; 
        }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white min-h-screen">
      <div class="grid grid-cols-12 min-h-screen">
        <!-- Sidebar -->
        <aside class="col-span-4 bg-slate-100 p-8 text-slate-800">
           <h1 class="text-[1.5em] font-bold mb-1 break-words" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
           ${title ? `<p class="text-[1.1em] font-medium mb-4" style="color: ${textColor}">${title}</p>` : ''}
           
           <div class="text-[0.9em] mb-8 flex flex-col gap-1" style="color: ${textColor}">
             ${contactLinks.map(link => `<a href="${link.href}" class="hover:text-blue-600 block break-all">${link.value}</a>`).join('')}
           </div>

           ${skills && skills.length > 0 ? `
             <div class="mb-8">
               <h2 class="font-bold text-[1.1em] mb-3 uppercase tracking-wider border-b border-slate-300 pb-1" style="color: ${headerColor}">Skills</h2>
               <div class="flex flex-wrap gap-2">
                 ${(Array.isArray(skills) ? skills : []).map(s => `<span class="bg-white px-2 py-1 rounded shadow-sm text-sm" style="color: ${textColor}">${s}</span>`).join('')}
               </div>
             </div>
           ` : ''}
        </aside>

        <!-- Main Content -->
        <main class="col-span-8 p-8">
           ${summary ? `
             <section class="mb-8">
               <h2 class="font-bold text-[1.1em] mb-3 border-b-2 border-slate-200 pb-1" style="color: ${headerColor}">Profile</h2>
               <p class="leading-relaxed" style="color: ${textColor}">${summary}</p>
             </section>
           ` : ''}

           ${experience && experience.length > 0 ? `
             <section class="mb-8">
               <h2 class="font-bold text-[1.1em] mb-4 border-b-2 border-slate-200 pb-1" style="color: ${headerColor}">Experience</h2>
               ${formatList(experience)}
             </section>
           ` : ''}

           ${education && education.length > 0 ? `
             <section class="mb-8">
               <h2 class="font-bold text-[1.1em] mb-4 border-b-2 border-slate-200 pb-1" style="color: ${headerColor}">Education</h2>
               ${formatList(education)}
             </section>
           ` : ''}
           
           ${(data.customSections || []).map(s => `
              <section class="mb-8">
                <h2 class="font-bold text-[1.1em] mb-4 border-b-2 border-slate-200 pb-1" style="color: ${headerColor}">${s.title}</h2>
                <ul class="list-disc list-outside ml-4 space-y-1" style="color: ${textColor}">${formatList(s.content)}</ul>
              </section>
           `).join('')}
        </main>
      </div>
    </body>
    </html>
   `;
};

export const getMinimalTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;

  // Design Logic
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'ui-sans-serif, system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '0.7rem' : design?.size === 'large' ? '0.9rem' : '0.8rem';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const formatList = (items) => {
    if (!items) return '';
    if (typeof items === 'string') return items.split('\n').filter(l => l.trim()).map(l => `<li class="pl-1">${l.replace(/^[-•*]\s*/, '')}</li>`).join('');
    if (Array.isArray(items)) {
      return items.map(item => {
        if (typeof item === 'string') return `<li class="pl-1">${item.replace(/^[-•*]\s*/, '')}</li>`;
        const title = item.title || item.degree;
        const subtitle = item.company || item.institution;
        const date = [item.startDate, item.endDate].filter(Boolean).join(" - ");
        const desc = item.description || (item.gpa ? `GPA: ${item.gpa}` : "");
        return `
            <div class="mb-4">
              <div class="flex justify-between items-baseline">
                 <h3 class="font-bold" style="color: ${headerColor}">${title}</h3>
                 ${date ? `<span class="text-sm whitespace-nowrap ml-4" style="color: ${textColor}">${date}</span>` : ''}
              </div>
              ${subtitle ? `<div class="text-sm italic mb-1" style="color: ${textColor}">${subtitle}</div>` : ''}
              ${desc ? `<p class="text-sm whitespace-pre-line" style="color: ${textColor}">${desc}</p>` : ''}
            </div>
          `;
      }).join('');
    }
    return '';
  };

  const renderSection = (id) => {
    if (id === 'summary' && summary) {
      return `
         <section class="mb-6">
           <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">Summary</h2>
           <p class="leading-relaxed" style="color: ${textColor}">${summary}</p>
         </section>
       `;
    }
    if (id === 'skills' && skills && skills.length > 0) {
      return `
         <section class="mb-6">
           <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">Skills</h2>
           <p class="leading-relaxed" style="color: ${textColor}">${Array.isArray(skills) ? skills.join(", ") : skills}</p>
         </section>
       `;
    }
    if (id === 'experience' && experience && experience.length > 0) {
      return `
         <section class="mb-6">
           <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">Experience</h2>
           <div style="color: ${textColor}">${formatList(experience)}</div>
         </section>
       `;
    }
    if (id === 'education' && education && education.length > 0) {
      return `
          <section class="mb-6">
            <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">Education</h2>
            <div style="color: ${textColor}">${formatList(education)}</div>
          </section>
        `;
    }
    if (id.startsWith('custom-')) {
      const section = (data.customSections || []).find(s => s.id === id);
      if (section) {
        return `
            <section class="mb-6">
              <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">${section.title}</h2>
              <div style="color: ${textColor}"><ul class="list-disc list-outside ml-4 space-y-1">${formatList(section.content)}</ul></div>
            </section>
          `;
      }
    }
    return '';
  };

  const order = data.sectionOrder || ["summary", "skills", "experience", "education"];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { 
            font-family: ${fontFamily}; 
            font-size: ${fontSize};
            color: ${textColor};
            -webkit-print-color-adjust: exact; 
        }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto">
      <header class="border-b border-slate-300 pb-2 mb-6">
        <h1 class="text-[1.8em] font-semibold tracking-wide" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        ${title ? `<p class="text-[1.1em] font-medium mb-1" style="color: ${textColor}">${title}</p>` : ''}
        <div class="text-[0.9em] flex flex-wrap gap-2 items-center" style="color: ${textColor}">
          ${contactLinks.map((link, i) => `
            ${i > 0 ? '<span>|</span>' : ''}
            <a href="${link.href}" class="hover:text-blue-600">${link.value}</a>
          `).join('')}
        </div>
      </header>

      ${order.map(id => renderSection(id)).join('')}
      
      ${(!data.sectionOrder && data.customSections) ? data.customSections.map(s => `
          <section class="mb-6">
            <h2 class="font-bold text-[1.1em] mb-2 uppercase tracking-widest border-b border-slate-200 pb-1" style="color: ${headerColor}">${s.title}</h2>
            <div style="color: ${textColor}"><ul class="list-disc list-outside ml-4 space-y-1">${formatList(s.content)}</ul></div>
          </section>
      `).join('') : ''}
    </body>
    </html>
  `;
};

export const getCleanResumeTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '11px' : design?.size === 'large' ? '14px' : '13px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed">
      <header class="border-b border-slate-300 pb-3 mb-4">
        <h1 class="text-2xl font-semibold tracking-tight" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        ${title ? `<p class="text-sm mt-1 uppercase tracking-[0.18em]" style="color: ${textColor}">${title}</p>` : ''}
        <p class="text-[0.9em] mt-2 space-x-3" style="color: ${textColor}">
          ${contactLinks.map((link, i) => `<span class="${i > 0 ? 'before:content-[\'•\'] before:mr-2' : ''}"><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></span>`).join('')}
        </p>
      </header>

      ${summary ? `
        <section class="mb-3">
          <h2 class="font-semibold text-[1em] tracking-[0.15em] uppercase mb-1.5" style="color: ${headerColor}">Summary</h2>
          <p class="whitespace-pre-line">${summary}</p>
        </section>
      ` : ''}

      ${skillList.length > 0 ? `
        <section class="mb-3">
          <h2 class="font-semibold text-[1em] tracking-[0.15em] uppercase mb-1.5" style="color: ${headerColor}">Skills</h2>
          <div class="flex flex-wrap gap-1.5">
            ${skillList.map(s => `<span class="rounded-full border border-slate-300 px-2 py-[2px] text-[0.9em]">${s}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${experience ? `
        <section class="mb-3">
          <h2 class="font-semibold text-[1em] tracking-[0.15em] uppercase mb-1.5" style="color: ${headerColor}">Experience</h2>
          <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
        </section>
      ` : ''}

      ${education ? `
        <section>
          <h2 class="font-semibold text-[1em] tracking-[0.15em] uppercase mb-1.5" style="color: ${headerColor}">Education</h2>
          <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
        </section>
      ` : ''}
    </body>
    </html>`;
};

export const getDenseUXTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '10px' : design?.size === 'large' ? '13px' : '12px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed">
      <header class="mb-4">
        <h1 class="text-2xl font-semibold tracking-tight" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        <p class="text-xs mt-1" style="color: ${textColor}">${title || ''}</p>
        <p class="text-[0.9em] mt-1 space-x-2" style="color: ${textColor}">
           ${contactLinks.map((link, i) => `<span class="${i > 0 ? 'before:content-[\'•\'] before:mr-2' : ''}"><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></span>`).join('')}
        </p>
      </header>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1 space-y-3">
          ${summary ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Profile</h2>
              <p class="whitespace-pre-line">${summary}</p>
            </section>
          ` : ''}
          ${skillList.length > 0 ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Skills</h2>
              <ul class="grid grid-cols-1 gap-0.5">
                ${skillList.map(s => `<li>• ${s}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
          ${education ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Education</h2>
              <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
            </section>
          ` : ''}
        </div>
        <div class="col-span-2">
          ${experience ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Work Experience</h2>
              <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
            </section>
          ` : ''}
        </div>
      </div>
    </body>
    </html>`;
};

export const getModernSplitTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '10px' : design?.size === 'large' ? '13px' : '12px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed break-words">
      <header class="mb-4 flex items-end justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
          <p class="text-xs mt-1" style="color: ${textColor}">${title || ''}</p>
        </div>
        <div class="text-[0.9em] text-right" style="color: ${textColor}">
          ${contactLinks.map(link => `<p><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></p>`).join('')}
        </div>
      </header>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3">
          ${summary ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Summary</h2>
              <p class="whitespace-pre-line">${summary}</p>
            </section>
          ` : ''}
          ${education ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Education</h2>
              <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
            </section>
          ` : ''}
        </div>
        <div class="space-y-3">
          ${skillList.length > 0 ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Skills</h2>
              <div class="flex flex-wrap gap-1.5">
                ${skillList.map(s => `<span class="px-2 py-[2px] rounded-full bg-slate-100 border border-slate-300 text-[0.9em]">${s}</span>`).join('')}
              </div>
            </section>
          ` : ''}
          ${experience ? `
            <section>
              <h2 class="font-semibold text-[0.9em] tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Experience</h2>
              <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
            </section>
          ` : ''}
        </div>
      </div>
    </body>
    </html>`;
};

export const getRoundedSectionsTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '10px' : design?.size === 'large' ? '13px' : '12px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed">
      <header class="mb-3">
        <h1 class="text-2xl font-semibold tracking-tight" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        <p class="text-xs mt-1" style="color: ${textColor}">${title || ''}</p>
        <p class="text-[0.9em] mt-1 space-x-2" style="color: ${textColor}">
           ${contactLinks.map((link, i) => `<span class="${i > 0 ? 'before:content-[\'•\'] before:mr-2' : ''}"><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></span>`).join('')}
        </p>
      </header>

      ${summary ? `
        <section class="mb-2">
          <h2 class="text-[0.9em] font-semibold tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Summary</h2>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p class="whitespace-pre-line">${summary}</p>
          </div>
        </section>
      ` : ''}

      ${skillList.length > 0 ? `
        <section class="mb-2">
          <h2 class="text-[0.9em] font-semibold tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Skills</h2>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div class="flex flex-wrap gap-1.5">
              ${skillList.map(s => `<span class="rounded-full bg-white border border-slate-200 px-2 py-[2px] text-[0.9em]">${s}</span>`).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      ${experience ? `
        <section class="mb-2">
          <h2 class="text-[0.9em] font-semibold tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Experience</h2>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
          </div>
        </section>
      ` : ''}

      ${education ? `
        <section class="mb-2">
          <h2 class="text-[0.9em] font-semibold tracking-[0.16em] uppercase mb-1" style="color: ${headerColor}">Education</h2>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
          </div>
        </section>
      ` : ''}
    </body>
    </html>`;
};

export const getSoftSidebarTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '10px' : design?.size === 'large' ? '13px' : '12px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed">
      <div class="grid grid-cols-[32%_1fr] gap-4">
        <aside class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-4 space-y-3">
          <div>
            <h1 class="text-xl font-semibold tracking-tight mb-0.5" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
            <p class="text-[0.9em]" style="color: ${textColor}">${title || ''}</p>
          </div>
          <div>
            <h2 class="text-[0.9em] font-semibold uppercase tracking-[0.16em] mb-1" style="color: ${headerColor}">Contact</h2>
            <p class="text-[0.9em] space-y-0.5">
              ${contactLinks.map(link => `<span class="block"><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></span>`).join('')}
            </p>
          </div>
          ${skillList.length > 0 ? `
            <div>
              <h2 class="text-[0.9em] font-semibold uppercase tracking-[0.16em] mb-1" style="color: ${headerColor}">Skills</h2>
              <ul class="text-[0.9em] space-y-0.5">
                ${skillList.map(s => `<li>• ${s}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </aside>

        <main class="space-y-3">
          ${summary ? `
            <section>
              <h2 class="text-[0.9em] font-semibold uppercase tracking-[0.16em] mb-1" style="color: ${headerColor}">Summary</h2>
              <p class="whitespace-pre-line">${summary}</p>
            </section>
          ` : ''}
          ${experience ? `
            <section>
              <h2 class="text-[0.9em] font-semibold uppercase tracking-[0.16em] mb-1" style="color: ${headerColor}">Experience</h2>
              <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
            </section>
          ` : ''}
          ${education ? `
            <section>
              <h2 class="text-[0.9em] font-semibold uppercase tracking-[0.16em] mb-1" style="color: ${headerColor}">Education</h2>
              <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
            </section>
          ` : ''}
        </main>
      </div>
    </body>
    </html>`;
};

export const getCleanSingleTemplate = (data) => {
  const { fullName, title, email, phone, location, github, linkedin, summary, skills, experience, education, design } = data;
  const fontFamily = design?.font === 'serif' ? 'Georgia, serif' : design?.font === 'mono' ? 'Courier New, monospace' : 'system-ui, sans-serif';
  const fontSize = design?.size === 'small' ? '10px' : design?.size === 'large' ? '13px' : '12px';
  const headerColor = design?.color || '#0f172a';
  const textColor = design?.textColor || '#334155';

  const contactLinks = [
    { value: email, label: email, href: `mailto:${email}` },
    { value: phone, label: phone, href: `tel:${phone}` },
    { value: location, label: location, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` },
    { value: github, label: github, href: github?.startsWith('http') ? github : `https://${github}` },
    { value: linkedin, label: linkedin, href: linkedin?.startsWith('http') ? linkedin : `https://${linkedin}` }
  ].filter(item => item.value);

  const skillList = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; -webkit-print-color-adjust: exact; }
        @page { margin: 0; size: auto; }
        a { color: inherit; text-decoration: none; }
      </style>
    </head>
    <body class="bg-white p-10 max-w-[210mm] mx-auto leading-relaxed border border-violet-200">
      <header class="mb-4">
        <h1 class="text-2xl font-semibold tracking-wide" style="color: ${headerColor}">${fullName || "Your Name"}</h1>
        <p class="text-sm tracking-wide uppercase" style="color: ${textColor}">${title || ''}</p>
      </header>

      ${summary ? `
        <section class="mb-4">
          <h2 class="mb-1 text-[0.9em] font-semibold uppercase tracking-[0.16em]" style="color: ${headerColor}">Professional Summary</h2>
          <p class="whitespace-pre-line">${summary}</p>
        </section>
      ` : ''}

      <section class="mb-4">
        <h2 class="mb-1 text-[0.9em] font-semibold uppercase tracking-[0.16em]" style="color: ${headerColor}">Contact</h2>
        <div class="flex justify-between text-[0.9em]">
          <div>
            ${contactLinks.filter(l => ['email', 'phone'].includes(l.label) || l.href.startsWith('mailto') || l.href.startsWith('tel')).map(link => `<p><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></p>`).join('')}
          </div>
          <div class="text-right">
            ${contactLinks.filter(l => !['email', 'phone'].includes(l.label) && !l.href.startsWith('mailto') && !l.href.startsWith('tel')).map(link => `<p><a href="${link.href}" class="hover:text-blue-600">${link.value}</a></p>`).join('')}
          </div>
        </div>
      </section>

      ${experience ? `
        <section class="mb-4">
          <h2 class="mb-1 text-[0.9em] font-semibold uppercase tracking-[0.16em]" style="color: ${headerColor}">Work Experience</h2>
          <p class="whitespace-pre-line">${typeof experience === 'string' ? experience : (Array.isArray(experience) ? experience.map(e => typeof e === 'string' ? e : `${e.title} at ${e.company}`).join('\n') : '')}</p>
        </section>
      ` : ''}

      ${education ? `
        <section class="mb-4">
          <h2 class="mb-1 text-[0.9em] font-semibold uppercase tracking-[0.16em]" style="color: ${headerColor}">Education</h2>
          <p class="whitespace-pre-line">${typeof education === 'string' ? education : (Array.isArray(education) ? education.map(e => typeof e === 'string' ? e : `${e.degree} at ${e.institution}`).join('\n') : '')}</p>
        </section>
      ` : ''}

      ${skillList.length > 0 ? `
        <section class="mb-4">
          <h2 class="mb-1 text-[0.9em] font-semibold uppercase tracking-[0.16em]" style="color: ${headerColor}">Skills & Certifications</h2>
          <p class="whitespace-pre-line">${skillList.join(', ')}</p>
        </section>
      ` : ''}
    </body>
    </html>`;
};


import { loadDb, updateDb, newId } from '../db.js';
import { parseNumber, type FlowDef } from '../flows.js';
import type { Student } from '../types.js';

export function listCourses(): string {
  const db = loadDb();
  const lines = ['🎓 *Cursuri SELECT ACADEMY*', ''];
  for (const c of db.courses) {
    lines.push(`• *${c.name}*`);
    lines.push(`  ${c.price} lei · ${c.durationWeeks} săptămâni`);
  }
  lines.push('', '_Înscrie un cursant cu /adauga_cursant._');
  return lines.join('\n');
}

export function listStudents(): string {
  const db = loadDb();
  if (db.students.length === 0) {
    return '🎓 Niciun cursant înscris.\n\nAdaugă unul cu /adauga_cursant.';
  }
  const statusEmoji: Record<Student['status'], string> = {
    activ: '🟢',
    absolvit: '🎓',
    retras: '⚪️',
  };
  const lines = ['🎓 *Cursanți*', ''];
  for (const s of db.students) {
    const rest = s.totalFee - s.paid;
    const restTxt = rest > 0 ? ` · restanță *${rest} lei*` : ' · achitat ✅';
    lines.push(`${statusEmoji[s.status]} *${s.name}* — ${s.course}`);
    lines.push(`   plătit ${s.paid}/${s.totalFee} lei${restTxt}`);
  }
  return lines.join('\n');
}

export const addStudentFlow: FlowDef = {
  steps: [
    { prompt: '👤 *Cursant nou*\n\nNumele cursantului?', key: 'name' },
    { prompt: '📚 La ce curs se înscrie?', key: 'course' },
    { prompt: '💵 Taxa totală a cursului (lei)?', key: 'totalFee', parse: parseNumber },
    { prompt: '💰 Cât a achitat acum (lei)? (0 dacă nimic)', key: 'paid', parse: parseNumber },
    { prompt: '📞 Telefon? (sau „-")', key: 'phone', optional: true },
  ],
  finish: (data) => {
    const student: Student = {
      id: newId('stu'),
      name: String(data.name),
      course: String(data.course),
      totalFee: Number(data.totalFee),
      paid: Number(data.paid),
      phone: data.phone ? String(data.phone) : undefined,
      status: 'activ',
      enrolledAt: Date.now(),
    };
    updateDb((db) => db.students.push(student));
    const rest = student.totalFee - student.paid;
    const restTxt = rest > 0 ? `\nRestanță: *${rest} lei*` : '\nTaxă achitată integral ✅';
    return `✅ Cursant înscris: *${student.name}*\nCurs: ${student.course}${restTxt}`;
  },
};

export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

function toVal(mix: ClassValue): string {
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k]);
          if (y) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    }
  }

  return str;
}

export function clsx(...inputs: ClassValue[]): string {
  let i = 0, tmp, str = '';
  while (i < inputs.length) {
    if ((tmp = inputs[i++])) {
      const x = toVal(tmp);
      if (x) {
        str && (str += ' ');
        str += x;
      }
    }
  }
  return str;
}

function twMerge(...classLists: string[]): string {
  // Simple merge - just combine and deduplicate
  const classes = classLists.join(' ').split(' ').filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  
  // Process in reverse to keep last occurrence
  for (let i = classes.length - 1; i >= 0; i--) {
    const cls = classes[i];
    if (!seen.has(cls)) {
      seen.add(cls);
      result.unshift(cls);
    }
  }
  
  return result.join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

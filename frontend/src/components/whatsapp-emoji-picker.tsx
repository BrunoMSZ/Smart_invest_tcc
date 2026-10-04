import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type EmojiCategory = {
  id: string;
  label: string;
  icon: string;
  emojis: string[];
};

/** Categorias no estilo WhatsApp (variedade ampla) */
export const WHATSAPP_EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    label: "Smileys",
    icon: "😀",
    emojis: [
      "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩",
      "😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐",
      "🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒",
      "🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","😟",
      "🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖",
      "😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡",
      "👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
    ],
  },
  {
    id: "gestures",
    label: "Gestos",
    icon: "👋",
    emojis: [
      "👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆",
      "🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️",
      "💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅",
      "👄","💋","🩸","👶","👧","🧒","👦","👩","🧑","👨","👵","🧓","👴","👲","👳","👮",
    ],
  },
  {
    id: "hearts",
    label: "Corações",
    icon: "❤️",
    emojis: [
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖",
      "💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈",
      "♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️",
    ],
  },
  {
    id: "animals",
    label: "Animais",
    icon: "🐶",
    emojis: [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵",
      "🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗",
      "🐴","🦄","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🪰","🪲","🪳","🦟","🦗","🕷️","🕸️",
      "🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳",
    ],
  },
  {
    id: "food",
    label: "Comida",
    icon: "🍕",
    emojis: [
      "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥",
      "🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠",
      "🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴",
      "🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🥫","🍝",
      "🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡",
      "🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜",
      "🍯","🥛","🍼","☕","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹",
    ],
  },
  {
    id: "activity",
    label: "Atividades",
    icon: "⚽",
    emojis: [
      "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍",
      "🏏","🪃","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌",
      "🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽",
      "🚣","🧗","🚴","🚵","🎪","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🪘","🎷",
      "🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🎰","🧩",
    ],
  },
  {
    id: "travel",
    label: "Viagem",
    icon: "✈️",
    emojis: [
      "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🦯","🦽",
      "🦼","🛴","🚲","🛵","🏍️","🛺","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋",
      "🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈️","🛫","🛬","🛩️","💺","🛰️",
      "🚀","🛸","🚁","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","⚓","🪝","⛽","🚧","🚦","🚥",
      "🚏","🗺️","🗿","🗽","🗼","🏰","🏯","🏟️","🎡","🎢","🎠","⛲","⛱️","🏖️","🏝️","🏜️",
      "🌋","⛰️","🏔️","🗻","🏕️","⛺","🏠","🏡","🏘️","🏚️","🏗️","🏭","🏢","🏬","🏣","🏤",
    ],
  },
  {
    id: "objects",
    label: "Objetos",
    icon: "💡",
    emojis: [
      "⌚","📱","📲","💻","⌨️","🖥️","🖨️","🖱️","🖲️","🕹️","🗜️","💽","💾","💿","📀","📼",
      "📷","📸","📹","🎥","📽️","🎞️","📞","☎️","📟","📠","📺","📻","🎙️","🎚️","🎛️","🧭",
      "⏱️","⏲️","⏰","🕰️","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯️","🪔","🧯","🛢️","💸",
      "💵","💴","💶","💷","🪙","💰","💳","💎","⚖️","🪜","🧰","🪛","🔧","🔨","⚒️","🛠️",
      "⛏️","🪚","🔩","⚙️","🪤","🧱","⛓️","🧲","🔫","💣","🧨","🪓","🔪","🗡️","⚔️","🛡️",
      "🚬","⚰️","🪦","⚱️","🏺","🔮","📿","🧿","💈","⚗️","🔭","🔬","🕳️","🩹","🩺","💊",
      "💉","🩸","🧬","🦠","🧫","🧪","🌡️","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼",
    ],
  },
  {
    id: "symbols",
    label: "Símbolos",
    icon: "💯",
    emojis: [
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖",
      "💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⚛️","🉑",
      "☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","🉐","㊙️","㊗️","🈴",
      "🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯",
      "💢","♨️","🚷","🚯","🚳","🚱","🔞","📵","🚭","❗","❕","❓","❔","‼️","⁉️","🔅",
      "🔆","〽️","⚠️","🚸","🔱","⚜️","🔰","♻️","✅","🈯","💹","❇️","✳️","❎","🌐","💠",
      "Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🛗","🛂","🛃","🛄","🛅","🚹","🚺","🚼","⚧️",
      "🚻","🚮","🎦","📶","🈁","🔣","ℹ️","🔤","🔡","🔠","🆖","🆗","🆙","🆒","🆕","🆓",
      "0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔢","#️⃣","*️⃣","⏏️","▶️",
    ],
  },
  {
    id: "flags",
    label: "Bandeiras",
    icon: "🏳️",
    emojis: [
      "🏳️","🏴","🏁","🚩","🏳️‍🌈","🏳️‍⚧️","🇧🇷","🇺🇸","🇵🇹","🇪🇸","🇦🇷","🇲🇽","🇨🇦","🇬🇧","🇫🇷","🇩🇪",
      "🇮🇹","🇯🇵","🇨🇳","🇰🇷","🇮🇳","🇷🇺","🇦🇺","🇳🇿","🇿🇦","🇺🇾","🇨🇱","🇨🇴","🇵🇪","🇵🇾","🇧🇴","🇻🇪",
    ],
  },
];

type WhatsAppEmojiPickerProps = {
  onSelect: (emoji: string) => void;
  className?: string;
};

export function WhatsAppEmojiPicker({ onSelect, className }: WhatsAppEmojiPickerProps) {
  const [categoryId, setCategoryId] = useState(WHATSAPP_EMOJI_CATEGORIES[0]!.id);
  const [query, setQuery] = useState("");

  const category = useMemo(
    () => WHATSAPP_EMOJI_CATEGORIES.find((c) => c.id === categoryId) || WHATSAPP_EMOJI_CATEGORIES[0]!,
    [categoryId],
  );

  const displayEmojis = useMemo(() => {
    if (!query.trim()) return category.emojis;
    const q = query.trim().toLowerCase();
    const matchedCats = WHATSAPP_EMOJI_CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q),
    );
    if (matchedCats.length) return matchedCats.flatMap((c) => c.emojis);
    return category.emojis;
  }, [category, query]);

  return (
    <div
      className={cn(
        "flex h-72 w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-[#1F2C34] shadow-2xl",
        className,
      )}
    >
      <div className="border-b border-white/10 p-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar emoji"
          className="w-full rounded-lg border-0 bg-[#0B141A] px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-0.5 overflow-x-auto border-b border-white/10 px-1.5 py-1.5 scrollbar-none">
        {WHATSAPP_EMOJI_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            onClick={() => {
              setCategoryId(c.id);
              setQuery("");
            }}
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base transition-colors",
              categoryId === c.id && !query ? "bg-white/15" : "hover:bg-white/10",
            )}
          >
            {c.icon}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {query.trim() ? "Resultados" : category.label}
        </p>
        <div className="grid grid-cols-8 gap-0.5">
          {displayEmojis.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              type="button"
              onClick={() => onSelect(emoji)}
              className="grid h-9 w-9 place-items-center rounded-lg text-xl transition-transform hover:scale-110 hover:bg-white/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

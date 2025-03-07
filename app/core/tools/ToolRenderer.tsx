import React from "react";
import { toolConfig } from "./index";
import { ToolConfig } from "./ToolConfig";
// Validation Error:

// {
//   "issues": [
//     {
//       "code": "invalid_type",
//       "expected": "object",
//       "received": "undefined",
//       "path": [],
//       "message": "Required"
//     }
//   ],
//   "name": "ZodError"
// }

// Raw data:

// {
//   "state": "call",
//   "step": 0,
//   "toolCallId": "toolu_01Gs3C7H4NAS5kfEcrXSgzah",
//   "toolName": "search",
//   "args": {
//     "query": "best ways to learn programming for beginners",
//     "limit": 5
//   }
// }
// {
//   "documents": [
//     {
//       "content": "![H:\\\\01_DHBW\\\\Projektarbeit\\\\DHBW_d_MOS_46mm_4c_ohne_schutzzone.jpg](/Users/janwirth/zentrale/docx-rag/output/media/media/image1.jpeg){width=\"1.8020833333333333in\"\nheight=\"0.875in\"}Duale Hochschule\\\nBaden-Württemberg\\\nMosbach\\\nLohrtalweg 10\\\n74821 Mosbach\n\nAnalyse und Vergleich der CSS Präprozessoren LESS, Sass und Stylus im\nHinblick auf benötigte Einarbeitungszeit, Praxisnutzen und Vor- bzw.\nNachteile gegenüber reinem CSS\n\nProjektarbeit im Rahmen des Studiengangs Onlinemedien\n\n**Sperrvermerk:** Nein\n\nInhalt\n\n[]{#_Toc .anchor}\n\nAbbildungsverzeichnis [II](#_Toc)\n\nTabellenverzeichnis [IV](#_Toc1)\n\nAbkürzungsverzeichnis [IV](#_Toc2)\n\n1.  1.  \n\n    <!-- -->\n\n    2.  \n\n    <!-- -->\n\n    3.  1.  \n\n        <!-- -->\n\n        2.  \n\n        <!-- -->\n\n        3.  \n\n<!-- -->\n\n2.  1.  1.  \n\n        <!-- -->\n\n        2.  \n\n        <!-- -->\n\n        3.  \n\n    <!-- -->\n\n    2.  1.  \n\n        <!-- -->\n\n        2.  \n\n        <!-- -->\n\n        3.  \n\n    <!-- -->\n\n    3.  \n\n<!-- -->\n\n3.  1.  \n\n    <!-- -->\n\n    2.  \n\nEinleitung [1](#einleitung)Problemstellung\n[1](#problemstellung)Zielsetzung [2](#zielsetzung)Vorbereitung --\nnichtfunktionelle Anforderungen an Quellcode\n[2](#vorbereitung-nichtfunktionelle-anforderungen-an-quellcode)Kriterien\n[2](#kriterien)Analyse von CSS [4](#analyse-von-css)Funktionelle\nAnforderungen an CSS Präprozessoren\n[8](#funktionelle-anforderungen-an-css-präprozessoren)Hauptteil\n[11](#hauptteil)Präprozessoren [11](#präprozessoren)SASS [12](#sass)LESS\n[12](#less)Stylus [13](#stylus)Prüfung der funktionellen Anforderungen\n[13](#prüfung-der-funktionellen-anforderungen)Grafische Oberfläche\n[13](#grafische-oberfläche)Geschwindigkeit [14](#geschwindigkeit)Tests\n[14](#tests)Entscheidungsfindung [33](#entscheidungsfindung)Schluss\n[36](#schluss)Fazit [36](#fazit)Ausblick\n[36](#ausblick)Literaturverzeichnis [5](#_Toc23)\n\nEhrenwörtliche Erklärung [7](#_Toc24)\n\nAbbildungsverzeichnis\n\nAbbildung 1 -- einfaches CSS 5\n\nAbbildung 2 -- Superset Syntax: Quellcode -- LESS, SASS, Stylus 14\n\nAbbildung 3 -- Superset Syntax: Resultat -- LESS, Stylus 15\n\nAbbildung 4 -- Superset Syntax: Resultat -- SASS 15\n\nAbbildung 5 -- minimalistische Syntax: Quellcode -- LESS, SASS, Stylus\n15\n\nAbbildung 6 -- minimalistische Syntax: Ergebnis - Stylus 16\n\nAbbildung 7 -- Variablen: Quellcode - LESS 17\n\nAbbildung 8 -- Variablen: Quellcode -- SASS 17\n\nAbbildung 9 -- Variablen: Quellcode - Stylus 18\n\nAbbildung 10 -- Variablen: Resultat -- LESS 18\n\nAbbildung 11 -- Variablen Resultat - SASS, Stylus 19\n\nAbbildung 12 -- Mixins: Quellcode - LESS 20\n\nAbbildung 13 -- Mixins: Quellcode -- SASS 20\n\nAbbildung 14 -- Mixins: Quellcode - Stylus 21\n\nAbbildung 15 -- Mixins: Resultat -- LESS, SASS, Stylus 21\n\nAbbildung 16 -- Vererbung: Quellcode - LESS 23\n\nAbbildung 17 -- Vererbung: Quellcode -- SASS, Stylus 24\n\nAbbildung 18 -- Selektorverkettung: Quellcode -- LESS, SASS, Stylus 26\n\nAbbildung 19 -- Selektorverkettung: Resultat -- LESS, SASS, Stylus 26\n\n[]{#_Toc1 .anchor}Tabellenverzeichnis\n\nTabelle 1 -- Geschwindigkeit: Benchmark Ergebnisse 13\n\nTabelle 2 - Wertung 27\n\n[]{#_Toc2 .anchor}Abkürzungsverzeichnis\n\nCSS\n\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\nCascading Stylesheets\n\nSASS\n\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\.....\nSyntactically Awesome Stylesheets\n\nSCSS\n\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\.....\nSassy Cascading Stylesheets\n\nLESS\n\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\...\\....\nLeaner Cascading Stylesheets",
//       "metadata": {
//         "header": "![H:\\\\01_DHBW\\\\Projektarbeit\\\\DHBW_d_MOS_46mm_4c_ohne_schutzzone.jpg](/Users/janwirth/zentrale/docx-rag/output/media/media/image1.jpeg){width=\"1.8020833333333333in\"",
//         "source": "/Users/janwirth/zentrale/docx-rag/output/example_doc.md",
//         "timestamp": "2025-03-07T09:35:38.170Z"
//       },
//       "distance": 0.22422527
//     }
//   ],
//   "summary": "Found 1 relevant sources in the documentation."
// }

export type ToolInvocation = {
  state: "result" | "call";
  step: number;
  toolCallId: string;
  toolName: keyof typeof toolConfig;
  args: unknown;
  result?: unknown;
};

type ToolRendererProps = {
  toolInvocation: ToolInvocation;
};

export function ToolRenderer({ toolInvocation }: ToolRendererProps) {
  const { toolName, result, state, args } = toolInvocation;
  const tool: ToolConfig = toolConfig[toolName];

  if (!tool) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  if (state === "call") {
    const parseArgs = tool.inputSchema.safeParse(args);
    if (!parseArgs.success) {
      return (
        <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
          <div className="text-red-500 mb-2">Input Validation Error:</div>
          <pre className="text-sm overflow-auto mb-2">
            {JSON.stringify(parseArgs.error, null, 2)}
          </pre>
          <div className="text-sm text-[var(--text-secondary)]">Raw args:</div>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
      );
    }
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  const parseResult = tool.outputSchema.safeParse(result);
  if (!parseResult.success) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <div className="text-red-500 mb-2">Validation Error:</div>
        <pre className="text-sm overflow-auto mb-2">
          {JSON.stringify(parseResult.error, null, 2)}
        </pre>
        <div className="text-sm text-[var(--text-secondary)]">Raw data:</div>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(toolInvocation, null, 2)}
        </pre>
      </div>
    );
  }

  const View = tool.view;
  return <View result={parseResult.data} />;
}

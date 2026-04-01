import pandas as pd
import re

def parse_activities(activity_str):
    if not isinstance(activity_str, str) or activity_str.lower() in ['nan', 'n/a', 'none']:
        return []
    s = activity_str.lower()
    s = s.replace('/', ',').replace(' and ', ',').replace('.', '').replace('\n', '')
    parts = [p.strip() for p in s.split(',')]
    tags = []
    for p in parts:
        if not p: continue
        if 'antioxidant' in p: tags.append('Antioxidant')
        elif 'anti-inflam' in p or 'antiinflam' in p: tags.append('Anti-inflammatory')
        elif 'cancer' in p or 'carcinogen' in p or 'tumor' in p: tags.append('Anticancer')
        elif 'neuro' in p or 'alzheimer' in p: tags.append('Neuroprotective')
        elif 'cardio' in p or 'heart' in p: tags.append('Cardioprotective')
        elif 'diabe' in p or 'hyperglyc' in p or 'glucose' in p: tags.append('Anti-diabetic')
        elif 'obes' in p or 'metabol' in p: tags.append('Anti-obesity')
        elif 'microb' in p or 'bacteri' in p: tags.append('Antimicrobial')
        elif 'viral' in p: tags.append('Antiviral')
        elif 'hepato' in p: tags.append('Hepatoprotective')
        elif 'allerg' in p: tags.append('Anti-allergic')
        elif 'cholesterol' in p or 'lipid' in p: tags.append('Hypocholesterolemic')
        elif 'eye' in p or 'macular' in p or 'ocular' in p or 'blue light' in p: tags.append('Eye Protector')
        elif 'stimulant' in p: tags.append('Stimulant')
        elif 'vasodilator' in p: tags.append('Vasodilator')
        elif 'immunomodulatory' in p or 'immune' in p: tags.append('Immunomodulatory')
        elif 'aging' in p: tags.append('Anti-aging')
        elif 'depressant' in p: tags.append('Anti-depressant')
        elif 'antigenotox' in p: tags.append('Antigenotoxicity')
        elif 'genotox' in p: tags.append('Genotoxicity')
    return list(set(tags))

df = pd.concat([pd.read_excel('ADB-compostos_padronizado-2.xlsx'), pd.read_excel('Blue_AmazonDB_padronizado (1).xlsx')])
acts = set()
for act in df['activity'].unique():
    parsed = parse_activities(str(act))
    for a in parsed: acts.add(a)

print(sorted(list(acts)))

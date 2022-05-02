# ITIS_6177_Final_Project
### By Dileep Kumar Komatineni

This is the final project assignment for ITIS 6177 that was to create an Named Entity Recognition API using [Azure Text Analytics](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/)


## Name Entity Recognition (NER)
Use this to identify and categorize entities in the input such as people, places, organizations, etc.

**Sample NER Input**
```
["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800", "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."]
```

### NER Entity Linking
Use this to identifies and disambiguates the identity of entities found in text. 

**Sample NER Entity Linking Input**
```
["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."]
```

### NER Personally Identifiable Information (PII)
Use this to identify, categorize, and redact sensitive information in unstructured text.

**Sample NER PII Input**
```
["The employee's phone number is (555) 555-5555."]

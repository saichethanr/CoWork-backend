import React, { useState, useRef, useEffect } from 'react';
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from './constant';
import Output from './Output';
import ACTIONS from '../Actions';

const CodeEditor = ({ socketRef, roomId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [userTyping, setUserTyping] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };



  //little worked
  if(socketRef.current){
  socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
    setValue(code);
   console.log(code);
  //  if(editorRef){
  //       editorRef.current.setValue(code);
  //  }

 })
}



  //working
  const handleEditorChange = (newValue) => {
    setValue(newValue);
    setUserTyping(true);

    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newValue
    });

    setTimeout(() => {
      setUserTyping(false);
    }, 500); // Adjust debounce delay as needed
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="100vh"
            theme="vs-dark"
            language={language}
            value={value}
            onChange={handleEditorChange}
          />
        </Box>
        <Output value={value} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;

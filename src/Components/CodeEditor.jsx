import {useState,useRef,useEffect} from 'react'
import {Box, HStack} from "@chakra-ui/react"
import { Editor } from '@monaco-editor/react'
import LanguageSelector from './LanguageSelector'
import { CODE_SNIPPETS } from './constant'
import Output from './Output'
import ACTIONS from '../Actions'

const CodeEditor = ({socketRef,roomId}) => {
  const editorRef=useRef()
  const [value,setValue]=useState('')
  const[language,setLanguage]=useState('javascript')

  const onMount=(editor)=>{
    editorRef.current=editor;
    editor.focus();
  };

  const onSelect=(language)=>{
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  }

  useEffect(() => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code
      });
    }
  }, [language]);


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);



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
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language}/>
      </HStack>
    </Box>
  );
}

export default CodeEditor

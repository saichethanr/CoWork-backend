import {useState} from 'react'
import {Box,Button,Text,useToast} from '@chakra-ui/react'
import { executeCode } from '../api';
const Output = ({value,language}) => {
  const [output,setOutput]=useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const toast=useToast();
  const [isError,setIsError]=useState(false)
    const runCode = async () => {
        const sourceCode = value;
        if (!sourceCode) return;
        try{
            setIsLoading(true);
            const{run:result}=await executeCode(language,sourceCode);
            setOutput(result.output.split("\n"));
            result.stderr?setIsError(true):setIsError(false);
        }
        catch(error){
          toast({
            title:"An error occured",
            description:error.message||"Unable to run code",
            status:"error",
            duration:6000,
          })
        }
        finally{
          setIsLoading(false);
        }
    };
  return (
    <Box w='50%'>
      <Text mb={2} fontSize='lg' color='white'>
        Output:
      </Text>
      <Button
      variant='outline'
      color="white"
      bg="green"
      mb={4}
      isLoading={isLoading}
      onClick={runCode}
      >
        Run Code
      </Button>
      <Box
      height='100vh'
      p={2}
      border='1px solid'
      borderRadius={4}
      color={
        isError? "Red":"white"
      } 
      >
        {output?
        output.map((line,i)=><Text key={i}>{line}</Text>)
        :'Click "Run Code" to see the output'}

      </Box>
    </Box>
  )
}

export default Output

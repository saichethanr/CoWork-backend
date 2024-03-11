import { Box, Text} from '@chakra-ui/react'
import React from 'react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
  } from '@chakra-ui/react'
import {LANGUAGE_VERSIONS} from './constant.js'

  const languages=Object.entries(LANGUAGE_VERSIONS)

const LanguageSelector = ({language,onSelect}) => {
  return (
    <Box ml={2} mb={4}>
      <Text mb={1} fontSize='lg' color="White">
        Language:
      </Text>
      <Menu isLazy>
  <MenuButton as={Button} sx={{
      bg: "blue.500", // Background color
      color: "Blue", // Text color
      borderRadius: "md", // Border radius
      width: "110px", // Width of the button
      height: "20px",// Height of the button
      _hover: { // Hover state
        bg: "blue.600",
      },
      _active: { // Active state
        bg: "blue.700",
},
}}>
    {language}
  </MenuButton>
  <MenuList zIndex={10} bg="#1100c1b">
    {
        languages.map(([lang,version])=>(
            <MenuItem key={lang} 
            color={
                lang===language? "blue.900":""
            }
            bg={
                lang===language? "gray.700":"White"
            }
            _hover={{
                color:"blue.900",
                bg:"gray.700"
            }
            }
            onClick={()=>onSelect(lang)}>{lang}
            &nbsp;
            <Text as="span" color="gray.600" fontSize="sm">
                {version}
            </Text>
            
            </MenuItem>
        ))
    }
  </MenuList>
</Menu>

</Box>
  )
}

export default LanguageSelector;

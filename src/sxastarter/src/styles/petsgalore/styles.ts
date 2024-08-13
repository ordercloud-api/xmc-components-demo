export const styles = {
  // styles for the `body`
  global: {
    body: {
      bg: 'white',
      color: 'text',
      form: {
        width: '100%',
      },

      a: {
        fontSize: '16px',
      },
      ul: {
        ml: '40px',
        mt: '15px',
      },

      '#addToCart': {
        width: '200px',
        border: '1px solid',
        borderColor: 'gray.300',
        ml: '20px',
        p: '15px',
      },
      '.white-space': {
        'white-space': 'break-spaces',
      },
      fontSize: '16px',
      '.react-datepicker__input-container': {
        input: {
          pt: '8px',
          pb: '10px',
          pl: '15px',
        },
      },
      _dark: {
        color: 'textColor.100',
      },
      h1: {
        fontSize: '28px',
        mb: '15px',
      },
      h2: {
        fontSize: '24px',
        mb: '15px',
      },
      h3: {
        fontSize: '22px',
        mb: '15px',
      },
      '.main-navigation': {
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'gray.600',
        textTransform: 'capitalized',
      },
      //Overrides for header issue
      header: {
        // background: '#f4f4f4',
        // shadow: 'lg',
        // mb: '15px',
        ul: {
          ml: '0px',
          mt: '0px',
          li: {
            display: 'inline-block',
            pb: '12px',
            mr: '40px',
          },
        },
      },
      footer: {
        mt: '60px',
        img: {
          margin: '0 auto',
        },
        ul: {
          ml: '0px',
          mt: '0px',
        },
        h3: {
          mb: '20px',
        },
      },

      // Moved to the edintcss.css file and used with a querystring to get to show up
      //   '.editing-mode': {
      //     '.grid': {
      //       border: '10px solid #cccc',
      //       margin: '10px',
      //     },
      //     '.griditem': {
      //       border: '10px solid #cccc',
      //       margin: '10px',
      //     },
      //     '.hstack': {
      //       border: '10px solid #cccc',
      //       margin: '10px',
      //     },
      //     '.vstack': {
      //       border: '10px solid #cccc',
      //       margin: '10px',
      //     },
      //     '.chakra-container': {
      //       border: '10px solid #cccc',
      //       margin: '10px',
      //     },
      //   },
    },
  },
};

export const Input = {
  baseStyle: {
    field: {
      fontWeight: 400,
      borderRadius: 'md',
    },
    addon: {
      border: '1px solid',
      borderColor: 'gray.200',
      background: 'gray.200',
      borderRadius: 'full',
      color: 'gray.500',

      _dark: {
        borderColor: 'gray.600',
        background: 'gray.600',
        color: 'gray.400',
      },
    },
  },

  variants: {
    primaryInput: {
      // Need both root and field for Text Area and Input to style
      bg: 'inputBg',
      border: '1px',
      height: '40px',
      fontSize: '18px',
      p: '10px',
      field: {
        bg: 'inputBg',
        border: '1px',
        height: '40px',
        fontSize: '18px',
        p: '10px',
      },
    },
    auth: {
      field: {
        bg: 'inputBg',
        border: '1px solid',
        borderColor: 'gray.200',
        _placeholder: 'gray.300',
      },
    },
    search: {
      field: {
        border: 'none',
        py: '11px',
        borderRadius: 'inherit',
        _placeholder: 'gray.300',
      },
    },
  },
  defaultProps: {
    variant: 'primaryInput',
  },
};

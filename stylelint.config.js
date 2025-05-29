export default {
    extends: ['stylelint-config-recommended', 'stylelint-prettier/recommended'],
    rules: {
      'selector-pseudo-class-no-unknown': [
        true,
        {
          ignorePseudoClasses: ['global'],
        },
      ],
      'property-no-unknown': [
        true,
        {
          ignoreProperties: ['composes'],
        },
      ],
    },
  }
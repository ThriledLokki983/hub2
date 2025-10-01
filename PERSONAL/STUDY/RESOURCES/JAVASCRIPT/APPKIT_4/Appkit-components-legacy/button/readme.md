propertyContent = [
    {
      title: 'ap-button',
      content: [
        {
          name: "kind",
          type: "string:'primary'|'secondary'|'tertiary'|'negative'|'text'",
          description: "Type of the button.",
          default: "'primary'",
          version: "4.0.0"
        },
        {
          name: "disabled",
          type: "boolean",
          description: "If it is true, it specifies that the button should be disabled.",
          default: "false",
          version: "4.0.0"
        },
        {
            name: "icon",
            type: "string",
            description: "Name of the icon.",
            default: "",
            version: "4.0.0"
        },
        {
            name: "loading",
            type: "boolean",
            description: "Whether the button can be triggered with loading state.",
            defaut: "false",
            version: "4.0.0"
        },
        {
          name: "add",
          type: "boolean",
          description: "Whether the button is an add button.",
          default: "false",
          version: "4.0.0"
        },
        {
          name: "compact",
          type: "boolean",
          description: "Whehter the button is compact.",
          default: "false",
          version: "4.0.0"
        },
        {
          name: "style",
          type: "React.CSSProperties",
          description: "The inline style of the component.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "className",
          type: 'string',
          description: "The style class names of the component.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onClick",
          type: "function",
          description: "Callback to invoke when the button is clicked.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onFocus",
          type: "function",
          description: "Callback to invoke when the button is focused.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onBlur",
          type: "function",
          description: "Callback to invoke when the button is blurred.",
          default: "",
          version: "4.0.0"
        },
      ]
    }
  ];

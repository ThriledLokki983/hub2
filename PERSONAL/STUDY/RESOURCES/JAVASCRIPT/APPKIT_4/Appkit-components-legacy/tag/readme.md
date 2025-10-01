propertyContent = [
    {
      title: 'ap-tag',
      content: [
        {
          name: "size",
          type: "string: 'sm' | 'lg'",
          description: "Specify the size of the Tag.",
          default: "'sm'",
          version: "4.0.0"
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Specify if tag is disabled.",
          default: "false",
          version: "4.0.0"
        },
        {
            name: "id",
            type: "string",
            description: "Specify the id for the tag.",
            default: "-",
            version: "4.0.0"
        },
        {
            name: "colorScheme",
            type: "string",
            description: "The color of tag, We preset five different colors, you can set color property such as primary, blue, green, orange, indigo, purple.",
            defaut: "primary",
            version: "4.0.0"
        },
        {
          name: "label",
          type: "string",
          description: "Text of tag.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "closable",
          type: "boolean",
          description: "Whether the Tag can be closed.",
          default: "false",
          version: "4.0.0"
        },
        {
          name: "visible",
          type: "boolean",
          description: "Whether the Tag is closed or not.",
          default: "false",
          version: "4.0.0"
        },
        {
          name: "onClose",
          type: '(e) => void',
          description: "Callback executed when tag is closed. The default behavior can be blocked by e.preventDefault().",
          default: "-",
          version: "4.0.0"
        }
      ]
    }
  ];

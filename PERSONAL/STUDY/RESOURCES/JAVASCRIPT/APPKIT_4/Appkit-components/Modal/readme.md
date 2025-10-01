propertyContent = [
    {
      title: 'ap-modal',
      content: [
        {
          name: "placement",
          type: "string:'top'|'right'|'bottom'|'left'|'center'",
          description: "The placement of modal.",
          default: "'center'",
          version: "4.0.0"
        },
        {
          name: "title",
          type: "string",
          description: "Title text of the dialog.",
          default: "",
          version: "4.0.0"
        },
        {
            name: "maskCloseable",
            type: "boolean",
            description: "Whether to close the modal dialog when the mask (area outside the modal) is clicked.",
            default: "true",
            version: "4.0.0"
        },
        {
            name: "closable",
            type: "boolean",
            description: "Does the dialog contain a close button.",
            defaut: "true",
            version: "4.0.0"
        },
        {
          name: "iconsComponent",
          type: "function",
          description: "Iconscomponent returns the reactnode structure.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "headerComponent",
          type: "function",
          description: "headerComponent returns the reactnode structure.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "style",
          type: "React.CSSProperties",
          description: "Style class of the component.&Inline style of the component's footer part.&Inline style of the component's content part.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "backdropStyle",
          type: 'React.CSSProperties',
          description: "Inline style of the component's backdrop part.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onOpen",
          type: "function",
          description: "Callback after modal opened with a parameter which is modalId.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onClose",
          type: "function",
          description: "Callback after modal closed with a parameter which is modalId.",
          default: "",
          version: "4.0.0"
        },
        {
          name: "onCancel",
          type: "function",
          description: "OnCancel is used to close the bomb layer method.",
          default: "",
          version: "4.0.0"
        },
      ]
    }
  ];

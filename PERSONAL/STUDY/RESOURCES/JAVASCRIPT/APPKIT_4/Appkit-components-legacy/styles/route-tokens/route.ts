const routes = [
  {
    "path": "accordion",
    "query": [
      "modifier=expanded",
      "modifier=multiExpand-expanded",
      "modifier=multiExpand"
    ]
  },
  {
    "path": "avatar",
    "query": [
      "variation=single",
      "variation=group",
      "variation=group&modifier=extra"
    ]
  },
  {
    "path": "badge",
    "query": [
      "variation=inline&modifier=filled&state=error",
      "variation=inline&modifier=filled&state=warning",
      "variation=inline&modifier=filled&state=success",
      "variation=inline&modifier=outlined&state=error",
      "variation=inline&modifier=outlined&state=warning",
      "variation=inline&modifier=outlined&state=success",
      "variation=inline&modifier=filled-group",
      "variation=inline&modifier=outlined-group",
      "variation=contained&modifier=filled&state=error",
      "variation=contained&modifier=filled&state=warning",
      "variation=contained&modifier=filled&state=success",
      "variation=contained&modifier=outlined&state=error",
      "variation=contained&modifier=outlined&state=warning",
      "variation=contained&modifier=outlined&state=success",
      "variation=contained&modifier=filled-group",
      "variation=contained&modifier=outlined-group"
    ]
  },
  {
    "path": "breadcrumb",
    "query": [
      "N/A",
      "modifier=icon"
    ]
  },
  {
    "path": "button",
    "query": [
      "variation=primary",
      "variation=primary&modifier=icon",
      "variation=primary&modifier=compact",
      "variation=primary&state=disabled",
      "variation=primary&state=loading",
      "variation=primary&modifier=icon-compact",
      "variation=primary&modifier=icon&state=disabled",
      "variation=primary&modifier=icon&state=loading",
      "variation=primary&modifier=compact&state=disabled",
      "variation=primary&modifier=compact&state=loading",
      "variation=primary&modifier=icon-compact&state=loading",
      "variation=primary&modifier=icon-compact&state=disabled",

      "variation=secondary",
      "variation=secondary&modifier=icon",
      "variation=secondary&modifier=compact",
      "variation=secondary&state=disabled",
      "variation=secondary&state=loading",
      "variation=secondary&modifier=icon-compact",
      "variation=secondary&modifier=icon&state=disabled",
      "variation=secondary&modifier=icon&state=loading",
      "variation=secondary&modifier=compact&state=disabled",
      "variation=secondary&modifier=compact&state=loading",
      "variation=secondary&modifier=icon-compact&state=loading",
      "variation=secondary&modifier=icon-compact&state=disabled",

      "variation=tertiary",
      "variation=tertiary&modifier=icon",
      "variation=tertiary&modifier=compact",
      "variation=tertiary&state=disabled",
      "variation=tertiary&state=loading",
      "variation=tertiary&modifier=icon-compact",
      "variation=tertiary&modifier=icon&state=disabled",
      "variation=tertiary&modifier=icon&state=loading",
      "variation=tertiary&modifier=compact&state=disabled",
      "variation=tertiary&modifier=compact&state=loading",
      "variation=tertiary&modifier=icon-compact&state=loading",
      "variation=tertiary&modifier=icon-compact&state=disabled",

      "variation=text",
      "variation=text&modifier=icon",
      "variation=text&modifier=compact",
      "variation=text&state=disabled",
      "variation=text&state=loading",
      "variation=text&modifier=icon-compact",
      "variation=text&modifier=icon&state=disabled",
      "variation=text&modifier=icon&state=loading",
      "variation=text&modifier=compact&state=disabled",
      "variation=text&modifier=compact&state=loading",
      "variation=text&modifier=icon-compact&state=loading",
      "variation=text&modifier=icon-compact&state=disabled",

      "variation=negative",
      "variation=negative&modifier=icon",
      "variation=negative&modifier=compact",
      "variation=negative&state=disabled",
      "variation=negative&state=loading",
      "variation=negative&modifier=icon-compact",
      "variation=negative&modifier=icon&state=disabled",
      "variation=negative&modifier=icon&state=loading",
      "variation=negative&modifier=compact&state=disabled",
      "variation=negative&modifier=compact&state=loading",
      "variation=negative&modifier=icon-compact&state=loading",
      "variation=negative&modifier=icon-compact&state=disabled",

      "variation=group",
      "variation=group&state=disabled",
      "variation=group&modifier=compact",
      "variation=group&state=disabled&modifier=compact",

      "variation=menu",
      "variation=menu&state=disabled",
      "variation=menu&modifier=compact",
      "variation=menu&state=disabled&modifier=compact",

      "variation=add",
      "variation=add&modifier=compact"
    ]
  },
  {
    "path": "checkbox",
    "query": [
      "variation=selected",
      "variation=selected&modifier=label",
      "variation=selected&modifier=list",
      "variation=selected&state=disabled",
      "variation=selected&modifier=label-list",
      "variation=selected&modifier=label&state=disabled",
      "variation=selected&state=disabled&modifier=list",
      "variation=selected&state=disabled&modifier=label-list",
      "variation=deselected",
      "variation=deselected&modifier=label",
      "variation=deselected&modifier=list",
      "variation=deselected&state=disabled",
      "variation=deselected&modifier=label-list",
      "variation=deselected&modifier=label&state=disabled",
      "variation=deselected&state=disabled&modifier=list",
      "variation=deselected&state=disabled&modifier=label-list",
      "variation=indeterminate",
      "variation=indeterminate&modifier=label",
      "variation=indeterminate&state=disabled",
      "variation=indeterminate&modifier=label&state=disabled",
    ]
  },
  {
    "path": "datepicker",
    "query": [
      "variation=single&modifier=singleSelection",
      "variation=double&modifier=singleSelection",
      "variation=custom&modifier=singleSelection",
      "variation=custom&modifier=dateRange",
      "variation=double&modifier=dateRange",
      "variation=single&modifier=dateRange"
    ]
  },
  {
    "path": "dropdown",
    "query": [
      "variation=singleSelection",
      "variation=multiple",
      "variation=singleSelection&modifier=search",
      "variation=multiple&modifier=search"
    ]
  },
  {
    "path": "feeds-comments",
    "query": [
      "variation=feed",
      "variation=feed&modifier=attachment",
      "variation=addComment",
      "variation=addComment&modifier=attachment"
    ]
  },
  {
    "path": "tree",
    "query": [
      "N/A"
    ]
  },
  {
    "path": "filter",
    "query": [
      "variation=singleselection&modifier=normal",
      "variation=singleselection&modifier=disabled",
      "variation=singleselection&modifier=status",
      "variation=multipleselection&modifier=normal",
      "variation=multipleselection&modifier=disabled",
      "variation=multipleselection&modifier=status"
    ]
  },
  {
    "path": "footer",
    "query": [
      "variation=text",
      "variation=links"
    ]
  },
  {
    "path": "header",
    "query": [
      "variation=default",
      "variation=default&modifier=solid",
      "variation=dropdown",
      "variation=dropdown&modifier=solid"
    ]
  },
  {
    "path": "field",
    "query": [
      "variation=default&state=default",
      "variation=default&state=disabled",
      "variation=default&state=error",
      "variation=default&state=readOnly",
      "variation=default&state=default&modifier=required",
      "variation=default&state=default&modifier=suggestion",
      "variation=default&state=default&modifier=required-suggestion",
      "variation=default&state=disabled&modifier=required",
      "variation=default&state=disabled&modifier=suggestion",
      "variation=default&state=disabled&modifier=required-suggestion",
      "variation=default&state=error&modifier=required",
      "variation=default&state=error&modifier=suggestion",
      "variation=default&state=error&modifier=required-suggestion",
      "variation=default&state=readOnly&modifier=required",
      "variation=default&state=readOnly&modifier=suggestion",
      "variation=default&state=readOnly&modifier=required-suggestion",
      "variation=clearText&state=default",
      "variation=clearText&state=disabled",
      "variation=clearText&state=error",
      "variation=clearText&state=readOnly",
      "variation=clearText&state=default&modifier=required",
      "variation=clearText&state=default&modifier=suggestion",
      "variation=clearText&state=default&modifier=required-suggestion",
      "variation=clearText&state=disabled&modifier=required",
      "variation=clearText&state=disabled&modifier=suggestion",
      "variation=clearText&state=disabled&modifier=required-suggestion",
      "variation=clearText&state=error&modifier=required",
      "variation=clearText&state=error&modifier=suggestion",
      "variation=clearText&state=error&modifier=required-suggestion",
      "variation=clearText&state=readOnly&modifier=required",
      "variation=clearText&state=readOnly&modifier=suggestion",
      "variation=clearText&state=readOnly&modifier=required-suggestion",
      "variation=datePicker&state=default",
      "variation=datePicker&state=disabled",
      "variation=datePicker&state=readOnly",
      "variation=datePicker&state=default&modifier=required",
      "variation=datePicker&state=disabled&modifier=required",
      "variation=datePicker&state=readOnly&modifier=required",
      "variation=dropdown&state=default",
      "variation=dropdown&state=disabled",
      "variation=dropdown&state=default&modifier=required",
      "variation=dropdown&state=disabled&modifier=required",
      "variation=passwordCreate&state=default",
      "variation=passwordCreate&state=disabled",
      "variation=passwordCreate&state=readOnly",
      "variation=passwordCreate&state=default&modifier=required",
      "variation=passwordCreate&state=disabled&modifier=required",
      "variation=passwordCreate&state=readOnly&modifier=required",
      "variation=passwordLogin&state=default",
      "variation=passwordLogin&state=disabled",
      "variation=passwordLogin&state=readOnly",
      "variation=passwordLogin&state=default&modifier=required",
      "variation=passwordLogin&state=disabled&modifier=required",
      "variation=passwordLogin&state=readOnly&modifier=required",
      "variation=phoneNumber&state=default",
      "variation=phoneNumber&state=disabled",
      "variation=phoneNumber&state=readOnly",
      "variation=phoneNumber&state=default&modifier=required",
      "variation=phoneNumber&state=disabled&modifier=required",
      "variation=phoneNumber&state=readOnly&modifier=required",
      "variation=prefixAndSuffix&state=default",
      "variation=prefixAndSuffix&state=disabled",
      "variation=prefixAndSuffix&state=readOnly",
      "variation=prefixAndSuffix&state=default&modifier=required",
      "variation=prefixAndSuffix&state=disabled&modifier=required",
      "variation=prefixAndSuffix&state=readOnly&modifier=required",
      "variation=search&state=default",
      "variation=search&state=disabled",
      "variation=textArea&state=default",
      "variation=textArea&state=disabled",
      "variation=textArea&state=readOnly",
      "variation=textArea&state=default&modifier=required",
      "variation=textArea&state=disabled&modifier=required",
      "variation=textArea&state=readOnly&modifier=required",
      "variation=tooltip&state=default",
      "variation=tooltip&state=disabled",
      "variation=tooltip&state=error",
      "variation=tooltip&state=readOnly",
      "variation=tooltip&state=default&modifier=required",
      "variation=tooltip&state=default&modifier=suggestion",
      "variation=tooltip&state=default&modifier=required-suggestion",
      "variation=tooltip&state=disabled&modifier=required",
      "variation=tooltip&state=disabled&modifier=suggestion",
      "variation=tooltip&state=disabled&modifier=required-suggestion",
      "variation=tooltip&state=error&modifier=required",
      "variation=tooltip&state=error&modifier=suggestion",
      "variation=tooltip&state=error&modifier=required-suggestion",
      "variation=tooltip&state=readOnly&modifier=required",
      "variation=tooltip&state=readOnly&modifier=suggestion",
      "variation=tooltip&state=readOnly&modifier=required-suggestion"
    ]
  },
  {
    "path": "list",
    "query": [
      "variation=default&modifier=timeAfterListItem",
      "variation=default&modifier=textAfterListItem",
      "variation=default&modifier=toggleAfterListItem",
      "variation=default&modifier=customIconAfterListItem",
      "variation=default&modifier=closeIconAfterListItem",
      "variation=selection&modifier=checkboxList",
      "variation=selection&modifier=radioButtonList",
      "variation=selection&modifier=checkboxListWithBadge",
      "variation=avatar&modifier=description",
      "variation=avatar&modifier=noDescription",
      "variation=complex"
    ]
  },
  {
    "path": "loading",
    "query": [
      "variation=linear",
      "variation=linear&modifier=indeterminate",
      "variation=linear&modifier=compact",
      "variation=linear&modifier=indeterminate-compact",
      "variation=circular",
      "variation=circular&modifier=indeterminate",
      "variation=circular&modifier=compact",
      "variation=circular&modifier=indeterminate-compact"
    ]
  },
  {
    "path": "modal",
    "query": [
      "N/A",
      "modifier=headline",
      "modifier=headline-body",
      "modifier=headline-icon",
      "modifier=headline-badge",
      "modifier=headline-button",
      "modifier=headline-body-icon",
      "modifier=headline-body-badge",
      "modifier=headline-body-button",
      "modifier=headline-button-secondaryButton",
      "modifier=headline-body-icon-badge",
      "modifier=headline-body-icon-button",
      "modifier=headline-body-button-secondaryButton",
      "modifier=headline-body-icon-badge-button",
      "modifier=headline-body-icon-button-secondaryButton",
      "modifier=headline-body-icon-badge-button-secondaryButton",
      "modifier=icon",
      "modifier=icon-badge",
      "modifier=icon-button",
      "modifier=icon-button-secondaryButton",
      "modifier=icon-badge-button",
      "modifier=icon-badge-button-secondaryButton",
      "modifier=badge",
      "modifier=badge-button",
      "modifier=badge-button-secondaryButton",
      "modifier=button",
      "modifier=button-secondaryButton",

    ]
  },
  {
    "path": "notice",
    "query": [
      "N/A",
      "modifier=title",
      "modifier=hyperlink",
      "modifier=icon",
      "modifier=title-hyperlink",
      "modifier=title-hyperlink-icon",
      "modifier=title-icon",
      "modifier=hyperlink-icon"
    ]
  },
  {
    "path": "notification",
    "query": [

      "variation=default",
      "variation=default&modifier=title",
      "variation=default&modifier=hyperlink",
      "variation=default&modifier=icon",
      "variation=default&modifier=title-hyperlink",
      "variation=default&modifier=title-icon",
      "variation=default&modifier=hyperlink-icon",
      "variation=default&modifier=title-hyperlink-icon",


      "variation=error-fill&modifier=icon",
      "variation=error-fill&modifier=title-icon",
      "variation=error-fill&modifier=hyperlink-icon",
      "variation=error-fill&modifier=title-hyperlink-icon",

      "variation=warning-fill&modifier=icon",
      "variation=warning-fill&modifier=title-icon",
      "variation=warning-fill&modifier=hyperlink-icon",
      "variation=warning-fill&modifier=title-hyperlink-icon",

      "variation=success-fill&modifier=icon",
      "variation=success-fill&modifier=title-icon",
      "variation=success-fill&modifier=hyperlink-icon",
      "variation=success-fill&modifier=title-hyperlink-icon",
    ]
  },
  {
    "path": "pagination",
    "query": [
      "N/A",
      "modifier=label"
    ]
  },
  {
    "path": "panel",
    "query": [
      "variation=simple",
      "variation=header"
    ]
  },
  {
    "path": "progress-bar",
    "query": [
      "variation=horizontal",
      "variation=horizontal&modifier=readonly",
      "variation=vertical",
      "variation=vertical&modifier=readonly",
    ]
  },
  {
    "path": "progress-stepper",
    "query": [
      "variation=horizontal",
      "variation=horizontal&modifier=readOnly",
      "variation=horizontal&modifier=label",
      "variation=horizontal&modifier=error",
      "variation=horizontal&modifier=readOnly-label",
      "variation=horizontal&modifier=readOnly-error",
      "variation=horizontal&modifier=label-error",
      "variation=horizontal&modifier=readOnly-label-error",
      "variation=vertical",
      "variation=vertical&modifier=readOnly",
      "variation=vertical&modifier=label",
      "variation=vertical&modifier=error",
      "variation=vertical&modifier=readOnly-label",
      "variation=vertical&modifier=readOnly-error",
      "variation=vertical&modifier=label-error",
      "variation=vertical&modifier=readOnly-label-error",
    ]
  },
  {
    "path": "radio",
    "query": [
      "variation=selected",
      "variation=selected&modifier=label",
      "variation=selected&modifier=list",
      "variation=selected&states=disabled",
      "variation=selected&modifier=label-list",
      "variation=selected&modifier=label&states=disabled",
      "variation=selected&states=disabled&modifier=list",
      "variation=selected&states=disabled&modifier=label-list",
      "variation=deselected",
      "variation=deselected&modifier=label",
      "variation=deselected&modifier=list",
      "variation=deselected&states=disabled",
      "variation=deselectedd&modifier=label-list",
      "variation=deselected&modifier=label&states=disabled",
      "variation=deselected&states=disabled&modifier=list",
      "variation=deselected&states=disabled&modifier=label-list",
    ]
  },
  {
    "path": "ratings",
    "query": [
      "variation=baselineRating&modifier=default",
      "variation=baselineRating&modifier=read-only",
      "variation=baselineRating&modifier=sentiment",
      "variation=baselineRating&modifier=sentimentSlider",
      "variation=writeReview&modifier=default",
      "variation=customerRatings&modifier=default",
      "variation=reviewComments&modifier=default",
      "variation=reviewComments&modifier=multi",
      "variation=reviewComments&modifier=attachment",
    ]
  },
  {
    "path": "texteditor",
    "query": [
      "variation=simple",
      "variation=expanded"
    ]
  },
  {
    "path": "search",
    "query": [
      "variation=primary",
      "variation=secondary",
      "variation=globalSearch",
      "variation=recentSearch",
      "variation=primary&states=disabled",
      "variation=secondary&states=disabled",
      "variation=globalSearch&states=disabled",
      "variation=recentSearch&states=disabled"
    ]
  },
  {
    "path": "navigation",
    "query": [
      "N/A"
    ]
  },
  {
    "path": "slider",
    "query": [
      "variation=single",
      "variation=range",
      "variation=singleInput",
      "variation=rangeInput",
      "variation=intervals",
      "variation=colors"
    ]
  },
  {
    "path": "tabs",
    "query": [
      "variation=underline&modifier=label",
      "variation=filled&modifier=label",
      "variation=filled&modifier=icon",
      "variation=filled&modifier=iconAndLabel"
    ]
  },
  {
    "path": "table",
    "query": [
      "variation=default",
      "variation=default&modifier=title",
      "variation=default&modifier=striped",
      "variation=default&modifier=checkbox",
      "variation=default&modifier=title-striped",
      "variation=default&modifier=title-checkbox",
      "variation=default&modifier=striped-checkbox",
      "variation=default&modifier=title-striped-checkbox",
      "variation=condensed",
      "variation=condensed&modifier=title",
      "variation=condensed&modifier=striped",
      "variation=condensed&modifier=checkbox",
      "variation=condensed&modifier=title-striped",
      "variation=condensed&modifier=title-checkbox",
      "variation=condensed&modifier=striped-checkbox",
      "variation=condensed&modifier=title-striped-checkbox"
    ]
  },
  {
    "path": "tag",
    "query": [
      "variation=inline",
      "variation=inline&modifier=group",
      "variation=inline&modifier=group&states=disabled",
      "variation=inline&states=disabled",
      "variation=contained",
      "variation=contained&modifier=group",
      "variation=contained&modifier=group&states=disabled",
      "variation=contained&states=disabled"
    ]
  },
  {
    "path": "toggle",
    "query": [
      "variation=inline",
      "variation=inline&states=disabled",
      "variation=contained&states=disabled",
      "variation=contained"
    ]
  },
  {
    "path": "tooltip",
    "query": [
      "N/A"
    ]
  },
  {
    "path": "file-upload",
    "query": [
      "variation=inline",
      "variation=inline&modifier=multiUpload",
      "variation=inline&modifier=trigger",
      "variation=inline&modifier=multiUpload-trigger",
      "variation=modal",
      "variation=modal&modifier=multiUpload",
      "variation=modal&modifier=trigger",
      "variation=modal&modifier=multiUpload-trigger",
    ]
  }
]

export default routes;
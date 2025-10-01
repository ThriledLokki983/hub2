// import { changeActivePage } from '../modules'

// a decorator to perform binding
export function Autobind(_: any, _2: string, desc: PropertyDescriptor) {
  const originalMethod = desc.value
  const adjDesc: PropertyDescriptor = {
    configurable: true,
    // this will be executed when we try to access the method this decorator is given to
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }
  return adjDesc
}

// export function ButtonEntity(theClass: Function) {
//   theClass.prototype.buttonArray = Array.from(
//     document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
//   )
// }

// export function ActivateButtons(templateId: string) {
//   return function (constructor: Function) {
//     const allTemplates = Array.from(
//       document.querySelectorAll('template') as NodeListOf<HTMLTemplateElement>
//     )

//     const template = allTemplates.find(
//       (template: HTMLTemplateElement) => template.id === `${templateId}`
//     ) as HTMLTemplateElement

//     constructor.prototype.templateElement = template
//   }
// }

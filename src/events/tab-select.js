export class RmTabSelectEvent extends CustomEvent {
  constructor(name) {
    super("rm-tab-select", { bubbles: true, cancelable: false, composed: true, detail: { name } })
  }
}

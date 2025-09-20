import {property, state} from 'lit/decorators.js';
import {html, LitElement} from "lit";


export class TestWc extends LitElement {
  constructor() {
    super();
  }

  // 3. Diese Methode ermöglicht das shadow-dom und damit styles die von außen kommen
  createRenderRoot() {
    return this;
  }

  @property({ type: String }) header = 'Hey there';

  @property({ type: Number }) counter = 5;


  // Der API-Schlüssel wird als Eigenschaft gesetzt
  @property({ type: String }) apiKey = '';

  // Zustand für die Daten und den Ladezustand
  @state()
  private data: any = null;

  @state()
  private isLoading = true;

  // Der API-Aufruf wartet, bis diese Promise auflöst.
  private eventPromise: Promise<any> | undefined;


  // `connectedCallback` ist ein guter Ort, um Daten beim Laden der Komponente zu holen
  connectedCallback() {
    super.connectedCallback();
    this.initializeEventListeners();
    this.fetchData().then(value => () => {
      // handledata
    }).catch((error) => {
      // handle error
    });
  }


  // Initialisiert die Event-Listener und erstellt die Promise
  private initializeEventListeners() {
    this.eventPromise = new Promise((resolve) => {
      // Hört auf ein übergeordnetes Event, das ein Wert übergeben kann
      this.addEventListener('my-custom-event', (event) => {
        const value = (event as CustomEvent).detail.value;
        // Die Promise wird mit dem Wert aufgelöst, sobald das Event auftritt
        resolve(value);
      }, { once: true }); // Fügt den Listener nur einmal hinzu
    });
  }

  async fetchData() {
    this.isLoading = true;
    try {

      // Der Code wartet hier, bis das Event ausgelöst wurde und die Promise auflöst
      const eventValue = await this.eventPromise;
      console.log('Event-Wert empfangen, starte API-Anruf:', eventValue);


      const response = await fetch('https://api.example.com/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Hier wird der API-Schlüssel im Header hinzugefügt
          'x-api-key': this.apiKey
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    } finally {
      this.isLoading = false;
    }
  }


  __increment() {
    this.counter += 1;
  }

  render() {
    // if (this.isLoading) {
    //   return html``;
    // }
    // if (this.data) {
      return html`
        <div class="bg-dark card w-50" >
          <h2>${this.header} Nr. ${this.data}!</h2>
          <button class="btn btn-success w-25" @click=${this.__increment}>stuff</button>
        </div>
      `;
    // }
    // return html``;
  }


}

export class SwipeCards {
    all_cards: HTMLElement[];
    all_responces: { htmlElement: HTMLElement, Resp: DOMTokenList }[];
    complete_callback: () => void;
    swipe_callback: () => void;

    constructor() {
        this.all_cards = [];
        this.all_responces = [];
        this.complete_callback = () => {};
        this.swipe_callback = () => {};
    }

    add_card(text: string): void {
        const card = document.createElement("div");
        card.id = 'card';

        const back_card = document.createElement("div");
        back_card.id = 'back';

        const front_card = document.createElement("div");
        front_card.id = "front";

        const span_text = document.createElement("span");
        span_text.innerText = text;

        front_card.appendChild(span_text);
        back_card.appendChild(front_card);
        card.appendChild(back_card);
        this.all_cards.push(card);
    }

    create(): void {
        const THIS = this;

        const every_cards_element = document.createElement("div");
        every_cards_element.id = "every_cards";

        this.all_cards.forEach((card, index) => {
            every_cards_element.appendChild(card);

            card.style.zIndex = `${this.all_cards.length - index}`;
            card.style.transform = `translateY(${index}px)`;
            const card_back = card.querySelector("#back") as HTMLElement;
            const card_front = card.querySelector("#front") as HTMLElement;

            // Event variables
            let is_mouse_down = false;
            let is_card_selected = false;

            // Store client position
            let first_x = 0;
            const sensibility = 3;

            // Events
            card.onmousemove = function(client) {
                const clientX = client.x;
                const new_x = clientX - first_x;

                if (is_mouse_down && Math.abs(new_x) > sensibility) {
                    const direction = new_x / Math.abs(new_x);

                    if (direction === 1) {
                        card_back.classList.add("swipe-right");
                        card_back.classList.remove("swipe-left");
                        is_card_selected = true;
                    } else if (direction === -1) {
                        card_back.classList.add("swipe-left");
                        card_back.classList.remove("swipe-right");
                        is_card_selected = true;
                    }
                }

                first_x = clientX;
            };

            card.onmouseleave = function() {
                is_mouse_down = false;
                is_card_selected = false;
                card_back.classList.remove("swipe-left");
                card_back.classList.remove("swipe-right");
            };

            card.onmousedown = function() {
                is_mouse_down = true;
            };

            card.onmouseup = function() {
                is_mouse_down = false;

                if (!is_card_selected) {
                    card_back.classList.remove("swipe-left");
                    card_back.classList.remove("swipe-right");
                } else {
                    card_back.classList.add("delete");

                    THIS.all_responces.push({
                        htmlElement: card,
                        Resp: card_back.classList
                    });

                    setTimeout(() => {
                        card.remove();

                        THIS.swipe_callback();

                        if (THIS.all_cards.length === THIS.all_responces.length) {
                            THIS.complete_callback();
                        }
                    }, 100);
                }
            };
        });

        const body = document.querySelector("body") as HTMLElement;
        body.appendChild(every_cards_element);
    }

    onComplete(callback: () => void): void {
        this.complete_callback = callback;
    }

    onSwipe(callback: () => void): void {
        this.swipe_callback = callback;
    }
}

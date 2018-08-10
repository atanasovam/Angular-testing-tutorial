import { MessageService } from "../message.service";

describe('MessageService', () => {

    let messageService: MessageService;

    beforeEach(() => messageService = new MessageService());

    it('should have no messages to start', () => {

        expect(messageService.messages.length).toEqual(0);

    });

    it('should have no messages when clear is called', () => {

        messageService.clear();
        expect(messageService.messages.length).toEqual(0);

    });

    describe('add', () => {

        let message: string;

        beforeEach(() => message = 'message 1');

        it('should add new message when add is called', () => {

            messageService.add(message);
            expect(messageService.messages.length).toEqual(1);

        });

        it('should save the new messages when add is called', () => {

            messageService.add(message);
            const actualSavedMessage: string = messageService.messages[messageService.messages.length - 1];

            expect(actualSavedMessage).toEqual(message);

        });

    });

});

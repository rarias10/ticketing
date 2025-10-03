import { Subjects, Publisher, ExpirationCompleteEvent } from "@awatickets/common";

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
export { ExpirationCompletePublisher };
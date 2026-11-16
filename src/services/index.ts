/**
 * The one place that decides which implementation of each outside service
 * the app uses. Screens import from here and nowhere else.
 *
 * To connect a real service later, change the right-hand side of one line.
 */
import { sampleDraftingService, type DraftingService } from "./drafting/drafting-service";
import { sampleDeliveryService, type DeliveryService } from "./delivery/delivery-service";
import {
  sampleTranscriptionService,
  type TranscriptionService,
} from "./transcription/transcription-service";

export const transcriptionService: TranscriptionService = sampleTranscriptionService;
export const draftingService: DraftingService = sampleDraftingService;
export const deliveryService: DeliveryService = sampleDeliveryService;

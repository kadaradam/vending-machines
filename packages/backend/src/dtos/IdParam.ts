import { Transform } from 'class-transformer';
import mongoose from 'mongoose';

export class IdParam {
	@Transform((id) => new mongoose.Types.ObjectId(id.value))
	id: mongoose.Types.ObjectId;
}

import {now} from 'minimal-time-helpers';

/** @returns {import('@workspace/models').CreationTime} */
export function createdNow() {
	return {whenCreated: now()};
}

/** @returns {import('@workspace/models').UpdateTime} */
export function updatedNow() {
	return {whenUpdated: now()};
}

/** @returns {import('@workspace/models').DeletionTime} */
export function deletedNow() {
	return {whenDeleted: now()};
}


import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateSubjectInput } from './inputs'
import { SubjectModel } from './models'
import { SubjectService } from './subject.service'

@Resolver('Subject')
export class SubjectResolver {
	constructor(private readonly subjectService: SubjectService) {}

	@Query(() => [SubjectModel], { name: 'getSubjects' })
	public async subjects() {
		return this.subjectService.getAll()
	}

	@Mutation(() => Boolean, { name: 'createSubject' })
	public async createSubject(@Args('data') input: CreateSubjectInput) {
		return this.subjectService.create(input)
	}
}

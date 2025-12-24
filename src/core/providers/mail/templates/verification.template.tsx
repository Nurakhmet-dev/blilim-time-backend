import {Body, Head, Heading, Hr, Html, Link, Preview, Section, Tailwind, Text} from '@react-email/components'
import * as React from 'react'


interface IVerificationTemplateProps {
    domain:string
    token:string
}

export default function VerificationTemplate ({ domain, token }:IVerificationTemplateProps) {
    const verificationLink = `http://${domain}/account/verify/?token=${token}`
    return(
        <Html>
            <Head/>
            <Preview>Верификация аккаунта</Preview>
            <Tailwind>
                <Body className='font-sans w-full mx-auto p-6 bg-slate-50'>
                    <Section className='max-w-lg mb-8 text-center border border-2 border-blue-300 bg-blue-50 rounded-2xl'>
                        <Heading className='text-3xl text-black font-bold leading-none px-4'>
                            Потверждение вашей почты
                        </Heading>
                        <Hr className='w-full block h-0.5 rounded bg-blue-300' />
                        <Section>
                            <Text className='text-base px-4'>
                                Спасибо за регистрацию в <span className='text-blue-500'>BilimTime! </span>
                                Чтобы потвердить свой адрес электронной почты,
                                пожалуйста, перейдите по следующей ссылке:
                            </Text>
                            <Link href={verificationLink}
                                className='inline-flex items-center justify-center rounded-full text-md font-semibold text-white bg-blue-700 py-2 px-16 mb-4'>
                                Потвердить почту
                            </Link>
                        </Section>
                        <Hr className='w-full block h-0.5 rounded bg-blue-300'/>
                        <Section>
                            <Text className='px-4 text-gray-600'>
                                Если y вас есть вопросы или вы столкнулись с трудностями,
                                не стесняйтесь обращаться в нашу службу поддержки по адресу{' '}
                                <Link
                                    href='mailto:nurakhmet.dev@gmail.com'
                                    className='text-blue-500 underline'
                                >
                                    nurakhmet.dev@gmail.com
                                </Link>
                            </Text>
                        </Section>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
};


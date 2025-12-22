import {Body, Column, Head, Heading, Hr, Html, Link, Preview, Row, Section, Tailwind, Text} from '@react-email/components'
import { SessionMetadata } from '@shared/types'
import * as React from 'react'

interface IPasswordRecoveryProps {
    domain:string
    token:string
    metadata:SessionMetadata
}

export default function PasswordRecovery({domain,token,metadata}:IPasswordRecoveryProps){
    const resetLink = `http://${domain}/account/reset/?token=${token}`
    return (
        <Html>
             <Head/>
             <Preview>Сброс пароля</Preview>
             <Tailwind>
                 <Body className='font-sans w-full mx-auto p-6 bg-slate-50'>
                     <Section className='max-w-lg mb-8 text-center border border-2 border-blue-300 bg-blue-50 rounded-2xl'>
                         <Heading className='text-3xl text-black font-bold leading-none px-4'>
                             Сброс пароля
                         </Heading>
                         <Hr className='w-full block h-0.5 rounded bg-blue-300' />
                         <Section>
                            <Text className="text-black text-base mt-2">
                                Вы запросили сброс пароля для вашей учетной записи. <br/>
                                Чтобы создать новый пароль, нажмите на ссылку ниже:
                            </Text>
                             <Link href={resetLink}
                                 className='inline-flex items-center justify-center rounded-full text-md font-semibold text-white bg-blue-700 py-2 px-16 mb-4'>
                                 Сбросить пароль
                             </Link>
                         </Section>
                         <Hr className='w-full block h-0.5 rounded bg-blue-300'/>
                         <Section>
                            <Heading className='text-xl text-black font-semibold leading-none px-4'>
                                Информация о запросе:
                            </Heading>
                            <Row>
                                <Column>🌏 Расположение: {metadata.location.city}</Column>
                                <Column>📱 Операционная система: {metadata.device.os}</Column>
                                <Column>🌐 Браузер: {metadata.device.browser}</Column>
                                <Column>💻 IP-agpec: {metadata.ip}</Column>
                            </Row>
                            <Text className='text-gray-600 px-10'>
                                Если вы не инициировали этот запрос, пожалуйста, игнорируйте это сообщение.
                            </Text>
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
}

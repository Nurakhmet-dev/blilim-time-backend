import {Body, Head, Heading, Hr, Html, Link, Preview, Row, Section, Tailwind, Text} from '@react-email/components'
import { SessionMetadata } from '@shared/types/session-metadata.types'
import * as React from 'react'

interface IDeactivateProps {
    token:string
    metadata:SessionMetadata
}

export default function Deactivate({
    token,
    metadata = {
        device:{
            browser:'',
            os:'',
            type:''
        },
        location:{
            city:'',
            country:'',
            latidute:0,
            longitude:0
        },
        ip:''

    }
}:IDeactivateProps){
    return (
        <Html>
             <Head/>
             <Preview>Деактивация аккаунта</Preview>
             <Tailwind>
                 <Body className='font-sans w-full mx-auto p-6 bg-slate-50'>
                     <Section className='max-w-lg mb-8 text-center border border-2 border-blue-300 bg-blue-50 rounded-2xl'>
                         <Heading className='text-3xl text-black font-bold leading-none px-4'>
                             Запрос на деактивацию аккаунта
                         </Heading>
                         <Hr className='w-full block h-0.5 rounded bg-blue-300' />
                         <Section>
                            <Text className="text-black text-base mt-2">
                            Вы инициировали процесс деактивации вашего аккаунта на платформе <b className='text-blue-500'>BilimTime</b>.
                            </Text>

                            <Heading className='text-2xl text-black font-semibold leading-none px-4'>
                                Код потверждения:
                            </Heading>
                             <Text className='text-2xl rounded-full border border-1 border-blue-300 py-3 px-8 mx-8'>
                                    {token}
                             </Text>
                             <Text className='text-black'>
                                    Этот код действителен в течение 5 минут.
                             </Text>
                         </Section>
                         <Hr className='w-full block h-0.5 rounded bg-blue-300'/>
                         <Section>
                            <Heading className='text-xl text-black font-semibold leading-none px-4'>
                                Информация о запросе:
                            </Heading>
                                <Row>🌏 Расположение: {metadata.location.city}</Row>
                                <Row>📱 Операционная система: {metadata.device.os}</Row>
                                <Row>🌐 Браузер: {metadata.device.browser}</Row>
                                <Row>💻 IP-agpec: {metadata.ip}</Row>
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

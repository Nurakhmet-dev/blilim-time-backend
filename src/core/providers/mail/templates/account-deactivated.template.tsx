import {Body, Head, Heading, Hr, Html, Link, Preview, Section, Tailwind, Text} from '@react-email/components'
import * as React from 'react'

interface IDeactivateProps {
    domain:string
}

export default function AccountDeactivated({ domain }:IDeactivateProps){
    const registerLink = `http://${domain}/account/create`
    return (
        <Html>
             <Head/>
             <Preview>Аккаунт удалён</Preview>
             <Tailwind>
                 <Body className='font-sans w-full mx-auto p-6 bg-slate-50'>
                     <Section className='max-w-lg mb-8 text-center border border-2 border-blue-300 bg-blue-50 rounded-2xl'>

                        <Heading className='text-3xl text-black font-bold leading-none px-4'>
                            Ваш аккаунт был полностью удалён
                        </Heading>

                        <Hr className='w-full block h-0.5 rounded bg-blue-300' />

                        <Section>
                            <Text className="text-black text-base mt-2">
                                Ваш аккаунт был полностью стерт из базы данных BilimTime.
                                Все ваши данные и информация были удалены безвозвратно.
                            </Text>
                        </Section>

                        <Hr className='w-full block h-0.5 rounded bg-blue-300' />

                        <Section className="text-center text-black">
                            <Text>
                                    Вы больше не будете получать уведомления в Telegram и на почту.
                                    Если вы захотите вернуться на платформу,
                                    вы можете зарегистрироваться по следующей ссылке:
                            </Text>
                            <Link
                                href={registerLink}
                                className="inline-flex justify-center items-center
                                rounded-md mt-2 text-sm font-medium text-white bg-
                                [#18B9AE] px-5 py-2 rounded-full">
                                Зарегистрироваться на Teastream
                            </Link>
                        </Section>

                        <Hr className='w-full block h-0.5 rounded bg-blue-300' />

                        <Section>
                            <Text>
                                Спасибо, что были с нами!
                                Мы всегда будем рады видеть вас на платформе.
                            </Text>
                        </Section>
                    </Section>
                 </Body>
             </Tailwind>
         </Html>
    )
}

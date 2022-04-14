/*import {useState, useEffect} from 'react'
import {NextPage} from 'next'
import {NextAppPageProps} from '../types/app'
import Layout from '../components/Layout'
import {FaLock, FaGithub} from 'react-icons/fa'
import {useAuth} from '../lib/auth'
import {useFormFields} from '../lib/utils'
import Navbar from '../components/Navbar'
import Example from './test'
import Image from 'next/image'
import Carousel from "../components/Carousel/Carousel";
import Card from "../components/Card/card";
import CardData from "../components/Card/CardData";
import CardLikeComment from "../components/Card/CardLikeComment";
import FourItemCard from "../components/Card/FourItemCard";

import Product from "../pages/product/[id]";


// define the shape of the SignUp form's fields
type SignUpFieldProps = {
    email: string,
    password: string
}

// the value we'd like to initialize the SignUp form with
const FORM_VALUES: SignUpFieldProps = {
    email: '',
    password: ''
}

const myLoader = ({src, width, quality}) => {
    return `https://localhost:3000/public/${src}?w=${width}&q=${quality || 75}`
}

const IndexPage: NextPage<NextAppPageProps> = ({}) => {
    return (
        <div>
            <Layout useBackdrop={false} usePadding={false}>
                HI
                <Card
                    title="Men-White-Watch"
                    description="Card description"
                    image="components/Slidebar/Screenshot(1082).png"
                />

                <div className="card w-96 bg-base-100 shadow-xl">
                    <figure><img src="https://api.lorem.space/image/shoes?w=400&h=225" alt="Shoes"/></figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Shoes!
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="card-actions justify-end">
                            <div className="badge badge-outline">Fashion</div>
                            <div className="badge badge-outline">Products</div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default IndexPage

IndexPage.defaultProps = {
    meta: {
        title: 'Ecom'
    }
}*/

import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

export async function getStaticProps() {
    const posts: Post[] = allPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date));
    });
    return { props: { posts } };
}

function PostCard(post: Post) {
    return (
        <div className="mb-8">
            <h2 className="text-xl">
                <Link href={post.url}>
                    <a className="text-blue-700 hover:text-blue-900">{post.title}</a>
                </Link>
            </h2>
            <time dateTime={post.date} className="block text-xs text-gray-600 mb-2">
                {format(parseISO(post.date), "LLLL d, yyyy")}
            </time>
            <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: post.body.html }}
            />
        </div>
    );
}

export default function Home({ posts }: { posts: Post[] }) {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Next.js Example</h1>

            {posts.map((post, idx) => (
                <PostCard key={idx} {...post} />
            ))}
        </div>
    );
}


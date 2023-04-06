import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import MapOutposts from '@components/MapOutposts';

import './OutpostsList.module.scss';

import state from './state.json';

interface PostType {
    address: string;
    budgets: string[];
    latitude: number;
    longitude: number;
}

const OutpostsList = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [current, setCurrent] = useState<number>(null);

    const handlerItem = (index) => {
        setCurrent(index);
    };

    useEffect(() => {
        setPosts(state?.pickPoints);
    }, []);

    return (
        <Container fluid className='page'>
            <Row>
                <Col sm xs={12}>
                    <ul className='outposts__list'>
                        {posts.length ? (
                            <>
                                {posts.map((post, index) => (
                                    <li
                                        key={`${post.latitude}${post.longitude}`}
                                        className={clsx([
                                            'outposts__item',
                                            current === index && 'outposts__item--current'
                                        ])}
                                        onClick={() => handlerItem(index)}
                                    >
                                        <div className='outposts__item-address'>{post.address}</div>
                                        <div className='budgets'>
                                            {post?.budgets?.length
                                                ? post.budgets.map((budget) => (
                                                      <div key={budget} className='budgets__item'>
                                                          {budget}
                                                      </div>
                                                  ))
                                                : ''}
                                        </div>
                                    </li>
                                ))}
                            </>
                        ) : (
                            ''
                        )}
                    </ul>
                </Col>
                <Col xs>
                    <MapOutposts setCurrent={setCurrent} current={current} data={posts} />
                </Col>
            </Row>
        </Container>
    );
};

export default OutpostsList;

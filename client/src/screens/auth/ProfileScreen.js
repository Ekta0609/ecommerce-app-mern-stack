import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getUserDetails, updateUserProfile } from '../../store/actions/userActions';
import { listMyOrders } from '../../store/actions/orderActions';

const ProfileScreen = ({ history }) => {
  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { name, email, password, confirmPassword } = info;
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: loadingOrders, error: errorOrders, orders } = useSelector((state) => state.orderListMy);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { success } = useSelector((state) => state.userUpdateProfile);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (!user.name) {
      dispatch(getUserDetails('profile'));
      dispatch(listMyOrders());
    } else {
      setInfo({ name: user.name, email: user.email });
    }
  }, [dispatch, history, userInfo, user]);

  const changeHandler = (e) => setInfo({ ...info, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" name="name" placeholder="Enter name" value={name} onChange={changeHandler} />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" value={email} onChange={changeHandler} />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={changeHandler}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="passwordConfirm"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={changeHandler}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {!loadingOrders ? (
          !errorOrders ? (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {orders.map(({ _id, createdAt, totalPrice, isPaid, paidAt, isDelivered, deliveredAt }) => (
                  <tr key={_id}>
                    <td>{_id}</td>

                    <td>{createdAt.substring(0, 10)}</td>

                    <td>{totalPrice}</td>

                    <td>
                      {isPaid ? paidAt.substring(0, 10) : <i className="fas fa-times" style={{ color: 'red' }} />}
                    </td>

                    <td>
                      {isDelivered ? (
                        deliveredAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: 'red' }} />
                      )}
                    </td>

                    <td>
                      <LinkContainer to={`/order/${_id}`}>
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Message variant="danger">{errorOrders}</Message>
          )
        ) : (
          <Loader />
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
